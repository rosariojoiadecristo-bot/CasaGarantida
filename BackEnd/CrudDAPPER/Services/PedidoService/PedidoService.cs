using CrudDAPPER.Models;
using Dapper;
using System.Data.SqlClient;

namespace CrudDAPPER.Services.PedidoService
{
    public class PedidoService : IPedidoInterface
    {
        private readonly IConfiguration configuration;
        private readonly string? getConnection;

        public PedidoService(IConfiguration configuration)
        {
            this.configuration = configuration;
            getConnection = this.configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<Pedido?> CriarPedido(
            int propriedadeId,
            int usuarioId,
            string tipoPedido,
            string? observacao)
        {
            using var connection = new SqlConnection(getConnection);
            await connection.OpenAsync();
            using var transaction = connection.BeginTransaction();

            try
            {
                // 1. Procurar status "Disponível"
                var statusDisponivel = await connection.QueryFirstOrDefaultAsync<int?>(
                    @"SELECT Id FROM propriedadeStatus WHERE Value = 'Disponível'",
                    transaction: transaction
                );

                if (statusDisponivel == null)
                    throw new Exception("Status 'Disponível' não encontrado.");

                // 2. Verificar propriedade
                var propriedade = await connection.QueryFirstOrDefaultAsync<dynamic>(
                    @"SELECT Id, Name, StatusId FROM propriedade WHERE Id = @Id",
                    new { Id = propriedadeId },
                    transaction
                );

                if (propriedade == null)
                    throw new Exception("Propriedade não encontrada.");

                // 3. Verificar se está disponível
                if ((int)propriedade.StatusId != statusDisponivel.Value)
                {
                    throw new Exception("Esta propriedade não está disponível para solicitação.");
                }

                // 4. Procurar Tipo do pedido
                var tipoId = await connection.QueryFirstOrDefaultAsync<int?>(
                    @"SELECT Id FROM pedidoTipo WHERE Value = @Value",
                    new { Value = tipoPedido },
                    transaction
                );

                if (tipoId == null)
                    throw new Exception("Tipo de pedido inválido. Use Compra ou Aluguel.");

                // 5. Procurar status Pendente
                var statusPendente = await connection.QueryFirstOrDefaultAsync<int?>(
                    @"SELECT Id FROM pedidoStatus WHERE Value = 'Pendente'",
                    transaction: transaction
                );

                if (statusPendente == null)
                    throw new Exception("Status 'Pendente' não encontrado.");

                // ==========================================
                // ALTERAÇÃO IMPORTANTE: 
                // Permitir múltiplos usuários solicitarem, 
                // mas evitar que O MESMO usuário crie pedidos 
                // duplicados pendentes para o mesmo imóvel.
                // ==========================================
                var existePedidoDoUsuario = await connection.ExecuteScalarAsync<int>(
                    @"SELECT COUNT(1) 
              FROM pedido 
              WHERE PropriedadeId = @PropriedadeId 
                AND UsuarioId = @UsuarioId 
                AND StatusId = @StatusId",
                    new
                    {
                        PropriedadeId = propriedadeId,
                        UsuarioId = usuarioId,
                        StatusId = statusPendente.Value
                    },
                    transaction
                );

                if (existePedidoDoUsuario > 0)
                {
                    throw new Exception("Você já possui um pedido pendente para esta propriedade.");
                }

                // 7. Criar pedido
                var sql = @"
            INSERT INTO pedido
            (
                PropriedadeId,
                UsuarioId,
                TipoId,
                StatusId,
                DataPedido,
                Observacao
            )
            OUTPUT INSERTED.Id
            VALUES
            (
                @PropriedadeId,
                @UsuarioId,
                @TipoId,
                @StatusId,
                GETDATE(),
                @Observacao
            );
        ";

                var pedidoId = await connection.ExecuteScalarAsync<int>(
                    sql,
                    new
                    {
                        PropriedadeId = propriedadeId,
                        UsuarioId = usuarioId,
                        TipoId = tipoId.Value,
                        StatusId = statusPendente.Value,
                        Observacao = observacao
                    },
                    transaction
                );

                transaction.Commit();

                return new Pedido
                {
                    Id = pedidoId,
                    PropriedadeId = propriedadeId,
                    UsuarioId = usuarioId,
                    TipoId = tipoId.Value,
                    StatusId = statusPendente.Value,
                    DataPedido = DateTime.Now,
                    Observacao = observacao
                };
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task<bool> AprovarPedido(
            int pedidoId,
            int processadoPor,
            int? anos = null,
            int? meses = null,
            int? dias = null)
        {
            using var connection = new SqlConnection(getConnection);
            await connection.OpenAsync();
            using var transaction = connection.BeginTransaction();

            try
            {
                // 1. Procurar pedido
                var pedido = await connection.QueryFirstOrDefaultAsync<dynamic>(
                    @"SELECT 
                pe.Id,
                pe.PropriedadeId,
                pe.UsuarioId,
                pe.TipoId,
                ps.Value AS StatusPedido,
                pt.Value AS TipoPedido
              FROM pedido pe
              INNER JOIN pedidoStatus ps ON pe.StatusId = ps.Id
              INNER JOIN pedidoTipo pt ON pe.TipoId = pt.Id
              WHERE pe.Id = @Id",
                    new { Id = pedidoId },
                    transaction
                );

                if (pedido == null)
                    throw new Exception("Pedido não encontrado.");

                if ((string)pedido.StatusPedido != "Pendente")
                    throw new Exception("Este pedido já foi processado.");

                var tipoPedido = (string)pedido.TipoPedido;

                // 2. Validar dados do contrato apenas para Aluguel
                DateTime? dataFimContrato = null;

                if (tipoPedido == "Aluguel")
                {
                    if ((anos ?? 0) <= 0 && (meses ?? 0) <= 0 && (dias ?? 0) <= 0)
                    {
                        throw new Exception(
                            "Para aprovar um aluguel é obrigatório indicar a duração do contrato (anos, meses ou dias)."
                        );
                    }

                    var agora = DateTime.Now;
                    dataFimContrato = agora
                        .AddYears(anos ?? 0)
                        .AddMonths(meses ?? 0)
                        .AddDays(dias ?? 0);
                }

                // 3. Procurar status do imóvel (Vendido ou Arrendado)
                var statusImovelDestino = (tipoPedido == "Compra") ? "Vendido" : "Arrendado";
                var statusImovelId = await connection.QueryFirstOrDefaultAsync<int?>(
                    @"SELECT Id FROM propriedadeStatus WHERE Value = @Value",
                    new { Value = statusImovelDestino },
                    transaction
                );

                if (statusImovelId == null)
                    throw new Exception("Status final do imóvel não encontrado.");

                // 4. Atualizar o imóvel (e associar locatário se for aluguel)
                int propriedadeAtualizada;

                propriedadeAtualizada = await connection.ExecuteAsync( @"UPDATE propriedade SET StatusId = @StatusId, LocatarioId = @LocatarioId WHERE Id = @Id AND StatusId = (SELECT Id FROM propriedadeStatus WHERE Value = 'Disponível')",
                    new
                    {
                        StatusId = statusImovelId.Value,
                        LocatarioId = (int)pedido.UsuarioId,
                        Id = (int)pedido.PropriedadeId
                    },
                transaction);

                if (propriedadeAtualizada == 0)
                    throw new Exception("O imóvel não está mais disponível.");

                // 5. Marcar o pedido como Aprovado + gravar DataFimContrato
                var statusAprovadoId = await connection.QueryFirstOrDefaultAsync<int?>(
                    @"SELECT Id FROM pedidoStatus WHERE Value = 'Aprovado'",
                    transaction: transaction
                );

                if (statusAprovadoId == null)
                    throw new Exception("Status 'Aprovado' não encontrado.");

                await connection.ExecuteAsync(
                    @"UPDATE pedido
              SET StatusId = @StatusId,
                  DataDecisao = GETDATE(),
                  ProcessadoPor = @ProcessadoPor,
                  DataFimContrato = @DataFimContrato
              WHERE Id = @Id",
                    new
                    {
                        StatusId = statusAprovadoId.Value,
                        ProcessadoPor = processadoPor,
                        DataFimContrato = (object?)dataFimContrato ?? DBNull.Value,
                        Id = pedidoId
                    },
                    transaction
                );

                // 6. Rejeitar automaticamente os restantes pedidos pendentes do mesmo imóvel
                var statusRejeitadoId = await connection.QueryFirstOrDefaultAsync<int?>(
                    @"SELECT Id FROM pedidoStatus WHERE Value = 'Rejeitado'",
                    transaction: transaction
                );

                if (statusRejeitadoId != null)
                {
                    await connection.ExecuteAsync(
                        @"UPDATE pedido
                  SET StatusId = @RejeitadoId,
                      DataDecisao = GETDATE(),
                      ProcessadoPor = @ProcessadoPor,
                      Observacao = ISNULL(Observacao, '') + ' [Rejeitado automaticamente: Outro pedido foi aprovado para este imóvel.]'
                  WHERE PropriedadeId = @PropriedadeId
                    AND Id <> @PedidoId
                    AND StatusId = (SELECT Id FROM pedidoStatus WHERE Value = 'Pendente')",
                        new
                        {
                            RejeitadoId = statusRejeitadoId.Value,
                            ProcessadoPor = processadoPor,
                            PropriedadeId = (int)pedido.PropriedadeId,
                            PedidoId = pedidoId
                        },
                        transaction
                    );
                }

                transaction.Commit();
                return true;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        // ==========================================
        // TODOS OS PEDIDOS
        // ==========================================

        public async Task<IEnumerable<PedidoDetalhe>> GetAllPedidos()
        {
            using var connection =
                new SqlConnection(getConnection);

            var sql = @"
                SELECT
                    pe.Id,
                    pe.PropriedadeId,
                    p.Name AS PropriedadeNome,

                    pe.UsuarioId,
                    CONCAT(u.firstName, ' ', u.lastName)
                        AS UsuarioNome,
                    u.email AS UsuarioEmail,

                    pe.TipoId,
                    pt.Value AS TipoPedido,

                    pe.StatusId,
                    ps.Value AS StatusPedido,

                    pe.DataPedido,
                    pe.DataDecisao,

                    pe.ProcessadoPor,
                    pe.Observacao

                FROM pedido pe

                INNER JOIN propriedade p
                    ON pe.PropriedadeId = p.Id

                INNER JOIN usuarios u
                    ON pe.UsuarioId = u.Id

                INNER JOIN pedidoTipo pt
                    ON pe.TipoId = pt.Id

                INNER JOIN pedidoStatus ps
                    ON pe.StatusId = ps.Id

                ORDER BY pe.DataPedido DESC;
            ";

            return await connection.QueryAsync<PedidoDetalhe>(sql);
        }

        // ==========================================
        // PEDIDOS PENDENTES
        // ==========================================

        public async Task<IEnumerable<PedidoDetalhe>> GetPedidosPendentes()
        {
            using var connection =
                new SqlConnection(getConnection);

            var sql = @"
                SELECT
                    pe.Id,
                    pe.PropriedadeId,
                    p.Name AS PropriedadeNome,

                    pe.UsuarioId,
                    CONCAT(u.firstName, ' ', u.lastName)
                        AS UsuarioNome,

                    u.email AS UsuarioEmail,

                    pe.TipoId,
                    pt.Value AS TipoPedido,

                    pe.StatusId,
                    ps.Value AS StatusPedido,

                    pe.DataPedido,
                    pe.DataDecisao,

                    pe.ProcessadoPor,
                    pe.Observacao

                FROM pedido pe

                INNER JOIN propriedade p
                    ON pe.PropriedadeId = p.Id

                INNER JOIN usuarios u
                    ON pe.UsuarioId = u.Id

                INNER JOIN pedidoTipo pt
                    ON pe.TipoId = pt.Id

                INNER JOIN pedidoStatus ps
                    ON pe.StatusId = ps.Id

                WHERE ps.Value = 'Pendente'

                ORDER BY pe.DataPedido ASC;
            ";

            return await connection.QueryAsync<PedidoDetalhe>(sql);
        }

        // ==========================================
        // PEDIDO POR ID
        // ==========================================

        public async Task<PedidoDetalhe?> GetPedidoById(int id)
        {
            using var connection =
                new SqlConnection(getConnection);

            var sql = @"
                SELECT
                    pe.Id,
                    pe.PropriedadeId,
                    p.Name AS PropriedadeNome,

                    pe.UsuarioId,
                    CONCAT(u.firstName, ' ', u.lastName)
                        AS UsuarioNome,

                    u.email AS UsuarioEmail,

                    pe.TipoId,
                    pt.Value AS TipoPedido,

                    pe.StatusId,
                    ps.Value AS StatusPedido,

                    pe.DataPedido,
                    pe.DataDecisao,

                    pe.ProcessadoPor,
                    pe.Observacao

                FROM pedido pe

                INNER JOIN propriedade p
                    ON pe.PropriedadeId = p.Id

                INNER JOIN usuarios u
                    ON pe.UsuarioId = u.Id

                INNER JOIN pedidoTipo pt
                    ON pe.TipoId = pt.Id

                INNER JOIN pedidoStatus ps
                    ON pe.StatusId = ps.Id

                WHERE pe.Id = @Id;
            ";

            return await connection.QueryFirstOrDefaultAsync<PedidoDetalhe>(
                sql,
                new { Id = id }
            );
        }

        // ==========================================
        // REJEITAR
        // ==========================================

        public async Task<bool> RejeitarPedido(
            int pedidoId,
            int processadoPor,
            string? observacao)
        {
            using var connection =
                new SqlConnection(getConnection);

            var pedido = await connection.QueryFirstOrDefaultAsync<dynamic>(
                @"
                SELECT
                    pe.Id,
                    ps.Value AS StatusPedido
                FROM pedido pe
                INNER JOIN pedidoStatus ps
                    ON pe.StatusId = ps.Id
                WHERE pe.Id = @Id
                ",
                new { Id = pedidoId }
            );

            if (pedido == null)
                return false;

            if ((string)pedido.StatusPedido != "Pendente")
                throw new Exception(
                    "Este pedido já foi processado."
                );

            var statusRejeitado =
                await connection.QueryFirstOrDefaultAsync<int?>(
                    @"
                    SELECT Id
                    FROM pedidoStatus
                    WHERE Value = 'Rejeitado'
                    "
                );

            if (statusRejeitado == null)
                throw new Exception(
                    "Status Rejeitado não encontrado."
                );

            var rows =
                await connection.ExecuteAsync(
                    @"
                    UPDATE pedido

                    SET
                        StatusId = @StatusId,
                        DataDecisao = GETDATE(),
                        ProcessadoPor = @ProcessadoPor,
                        Observacao = @Observacao

                    WHERE Id = @Id
                    ",
                    new
                    {
                        StatusId = statusRejeitado.Value,
                        ProcessadoPor = processadoPor,
                        Observacao = observacao,
                        Id = pedidoId
                    }
                );

            return rows > 0;
        }

        // ==========================================
        // PEDIDOS PENDENTES POR USUÁRIO
        // ==========================================

        public async Task<int> GetTotalPedidosPendentesPorUsuario(int usuarioId)
        {
            using var connection = new SqlConnection(getConnection);

            var sql = @"
        SELECT COUNT(1)
        FROM pedido pe
        INNER JOIN pedidoStatus ps ON pe.StatusId = ps.Id
        WHERE pe.UsuarioId = @UsuarioId
          AND ps.Value = 'Pendente';
    ";

            return await connection.ExecuteScalarAsync<int>(
                sql,
                new { UsuarioId = usuarioId }
            );
        }

        // ==========================================
        // PEDIDOS REJEITADOS POR USUÁRIO
        // ==========================================

        public async Task<int> GetTotalPedidosRejeitadosPorUsuario(int usuarioId)
        {
            using var connection = new SqlConnection(getConnection);

            var sql = @"SELECT COUNT(1) FROM pedido pe INNER JOIN pedidoStatus ps ON pe.StatusId = ps.Id WHERE pe.UsuarioId = @UsuarioId AND ps.Value = 'Rejeitado';";

            return await connection.ExecuteScalarAsync<int>(
                sql,
                new { UsuarioId = usuarioId }
            );
        }

        // Opcional: versão que devolve a lista completa (caso precises depois)
        public async Task<IEnumerable<PedidoDetalhe>> GetPedidosPendentesPorUsuario(int usuarioId)
        {
            using var connection = new SqlConnection(getConnection);

            var sql = @"
        SELECT
            pe.Id,
            pe.PropriedadeId,
            p.Name AS PropriedadeNome,
            pe.UsuarioId,
            CONCAT(u.firstName, ' ', u.lastName) AS UsuarioNome,
            u.email AS UsuarioEmail,
            pe.TipoId,
            pt.Value AS TipoPedido,
            pe.StatusId,
            ps.Value AS StatusPedido,
            pe.DataPedido,
            pe.DataDecisao,
            pe.ProcessadoPor,
            pe.Observacao
        FROM pedido pe
        INNER JOIN propriedade p ON pe.PropriedadeId = p.Id
        INNER JOIN usuarios u ON pe.UsuarioId = u.Id
        INNER JOIN pedidoTipo pt ON pe.TipoId = pt.Id
        INNER JOIN pedidoStatus ps ON pe.StatusId = ps.Id
        WHERE pe.UsuarioId = @UsuarioId
          AND ps.Value = 'Pendente'
        ORDER BY pe.DataPedido DESC;
    ";

            return await connection.QueryAsync<PedidoDetalhe>(
                sql,
                new { UsuarioId = usuarioId }
            );
        }

        // Opcional: versão que devolve a lista completa (caso precises depois)
        public async Task<IEnumerable<PedidoDetalhe>> GetPedidosRejeitadosPorUsuario(int usuarioId)
        {
            using var connection = new SqlConnection(getConnection);

            var sql = @"
        SELECT
            pe.Id,
            pe.PropriedadeId,
            p.Name AS PropriedadeNome,
            pe.UsuarioId,
            CONCAT(u.firstName, ' ', u.lastName) AS UsuarioNome,
            u.email AS UsuarioEmail,
            pe.TipoId,
            pt.Value AS TipoPedido,
            pe.StatusId,
            ps.Value AS StatusPedido,
            pe.DataPedido,
            pe.DataDecisao,
            pe.ProcessadoPor,
            pe.Observacao
        FROM pedido pe
        INNER JOIN propriedade p ON pe.PropriedadeId = p.Id
        INNER JOIN usuarios u ON pe.UsuarioId = u.Id
        INNER JOIN pedidoTipo pt ON pe.TipoId = pt.Id
        INNER JOIN pedidoStatus ps ON pe.StatusId = ps.Id
        WHERE pe.UsuarioId = @UsuarioId
          AND ps.Value = 'Rejeitado'
        ORDER BY pe.DataPedido DESC;
    ";

            return await connection.QueryAsync<PedidoDetalhe>(
                sql,
                new { UsuarioId = usuarioId }
            );
        }

        public async Task<bool> CancelarPedido(int pedidoId, int usuarioId)
        {
            using var connection = new SqlConnection(getConnection);
            await connection.OpenAsync();

            // 1. Opcional: Buscar o pedido primeiro para logar ou debugar o motivo exato
            var sqlCheck = "SELECT * FROM pedido WHERE Id = @Id";
            var pedido = await connection.QueryFirstOrDefaultAsync<dynamic>(sqlCheck, new { Id = pedidoId });

            if (pedido == null)
            {
                Console.WriteLine($"[DEBUG] Pedido {pedidoId} não existe.");
                return false;
            }
            if (pedido.UsuarioId != usuarioId)
            {
                Console.WriteLine($"[DEBUG] Dono incorreto. Pedido pertence ao usuário {pedido.UsuarioId}, mas foi requisitado pelo {usuarioId}.");
                return false;
            }
            if (pedido.StatusId != 1)
            {
                Console.WriteLine($"[DEBUG] Status inválido para cancelamento. Status atual: {pedido.StatusId}");
                return false;
            }

            // 2. Se passou pelas validações, executa o delete
            var sqlDelete = @"
        DELETE FROM pedido
        WHERE Id = @Id
          AND UsuarioId = @UsuarioId
          AND StatusId = (SELECT Id FROM pedidoStatus WHERE Value = 'Pendente');
    ";

            var rows = await connection.ExecuteAsync(sqlDelete, new { Id = pedidoId, UsuarioId = usuarioId });
            return rows > 0;
        }

        public async Task<bool> CancelarPedidoRejeitado(int pedidoId, int usuarioId)
        {
            using var connection = new SqlConnection(getConnection);
            await connection.OpenAsync();

            // 1. Opcional: Buscar o pedido primeiro para logar ou debugar o motivo exato
            var sqlCheck = "SELECT * FROM pedido WHERE Id = @Id";
            var pedido = await connection.QueryFirstOrDefaultAsync<dynamic>(sqlCheck, new { Id = pedidoId });

            if (pedido == null)
            {
                Console.WriteLine($"[DEBUG] Pedido {pedidoId} não existe.");
                return false;
            }
            if (pedido.UsuarioId != usuarioId)
            {
                Console.WriteLine($"[DEBUG] Dono incorreto. Pedido pertence ao usuário {pedido.UsuarioId}, mas foi requisitado pelo {usuarioId}.");
                return false;
            }
            if (pedido.StatusId != 3)
            {
                Console.WriteLine($"[DEBUG] Status inválido para cancelamento. Status atual: {pedido.StatusId}");
                return false;
            }

            // 2. Se passou pelas validações, executa o delete
            var sqlDelete = @"DELETE FROM pedido WHERE Id = @Id AND UsuarioId = @UsuarioId AND StatusId = (SELECT Id FROM pedidoStatus WHERE Value = 'Rejeitado');";

            var rows = await connection.ExecuteAsync(sqlDelete, new { Id = pedidoId, UsuarioId = usuarioId });
            return rows > 0;
        }

        public async Task<int> EncerrarContratosVencidos()
        {
            using var connection = new SqlConnection(getConnection);
            await connection.OpenAsync();

            // 1. Procurar status Indisponível
            var statusIndisponivelId = await connection.QueryFirstOrDefaultAsync<int?>(
                @"SELECT Id FROM propriedadeStatus WHERE Value = 'Indisponível'");

            if (statusIndisponivelId == null)
                throw new Exception("Status 'Indisponível' não encontrado.");

            // 2. Passar imóveis arrendados cujo contrato terminou → Indisponível + remover locatário
            var afetados = await connection.ExecuteAsync(
                @"UPDATE p
          SET p.StatusId = @StatusIndisponivelId,
              p.LocatarioId = NULL
          FROM propriedade p
          INNER JOIN pedido pe ON pe.PropriedadeId = p.Id
          INNER JOIN propriedadeStatus ps ON p.StatusId = ps.Id
          WHERE ps.Value = 'Arrendado'
            AND pe.DataFimContrato IS NOT NULL
            AND pe.DataFimContrato <= GETDATE()
            AND pe.StatusId = (SELECT Id FROM pedidoStatus WHERE Value = 'Aprovado')",
                new { StatusIndisponivelId = statusIndisponivelId.Value });

            return afetados;
        }

    }
}