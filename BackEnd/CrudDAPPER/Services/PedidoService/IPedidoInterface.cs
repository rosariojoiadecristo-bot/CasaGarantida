using CrudDAPPER.Models;

namespace CrudDAPPER.Services.PedidoService
{
    public interface IPedidoInterface
    {
        Task<Pedido?> CriarPedido( int propriedadeId, int usuarioId, string tipoPedido, string? observacao );

        Task<IEnumerable<PedidoDetalhe>> GetAllPedidos();

        Task<IEnumerable<PedidoDetalhe>> GetPedidosPendentes();

        Task<PedidoDetalhe?> GetPedidoById(int id);

        Task<bool> AprovarPedido( int pedidoId, int processadoPor, int? anos = null, int? meses = null, int? dias = null);

        Task<bool> RejeitarPedido( int pedidoId, int processadoPor, string? observacao );

        Task<int> GetTotalPedidosPendentesPorUsuario(int usuarioId);

        Task<int> GetTotalPedidosRejeitadosPorUsuario(int usuarioId);

        Task<IEnumerable<PedidoDetalhe>> GetPedidosPendentesPorUsuario(int usuarioId);

        Task<IEnumerable<PedidoDetalhe>> GetPedidosRejeitadosPorUsuario(int usuarioId);
        Task<bool> CancelarPedido(int pedidoId, int usuarioId);

        Task<bool> CancelarPedidoRejeitado(int pedidoId, int usuarioId);

        Task<int> EncerrarContratosVencidos();
    }
}
