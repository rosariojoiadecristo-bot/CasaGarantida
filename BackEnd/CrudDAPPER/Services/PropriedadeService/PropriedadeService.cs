using CrudDAPPER.Models;
using Dapper;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using System.Text.Json;

namespace CrudDAPPER.Services.PropriedadeService
{
    public class PropriedadeService : IPropriedadeInterface
    {
        private readonly IConfiguration configuration;
        private readonly string? getConnection;
        public PropriedadeService(IConfiguration configuration)
        {
            this.configuration = configuration;
            getConnection = this.configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IEnumerable<Propriedade>> CreatePropriedade(Propriedade propriedade)
        {
            using var connection = new SqlConnection(getConnection);
            var sql = @"INSERT INTO propriedade 
                        (Name, Descricao, Preco, Telefone, Email, Contacto, Quarto, Quintal, Garagem, Localizacao, Provincia, Estado, Regiao, UserId, TypeId, StatusId) 
                        VALUES 
                        (@Name, @Descricao, @Preco, @Telefone, @Email, @Contacto, @Quarto, @Quintal, @Garagem, @Localizacao, @Provincia, @Estado, @Regiao, @UserId, @TypeId, @StatusId)";

            await connection.ExecuteAsync(sql, propriedade);
            return await GetAllPropriedade();
        }

        public async Task<Propriedade?> GetPropriedadeById(int id)
        {
            using var connection = new SqlConnection(this.configuration.GetConnectionString("DefaultConnection"));
            var sql = @" SELECT p.*, t.*, s.* FROM propriedade p LEFT JOIN PropriedadeTipo t ON p.TypeId = t.Id LEFT JOIN PropriedadeStatus s ON p.StatusId = s.Id  WHERE p.Id = @Id";

            var propriedades = await connection.QueryAsync<Propriedade, PropriedadeTipo, PropriedadeStatus, Propriedade>(
                sql,
                (propriedade, tipo, status) =>
                {
                    propriedade.Tipo = tipo;
                    propriedade.Status = status;
                    return propriedade;
                },
                new { Id = id },
                splitOn: "Id,Id"
            );

            return propriedades.FirstOrDefault();
        }

        public async Task<bool> SaveImages(int propriedadeId, List<string> imagePaths)
        {
            using var connection = new SqlConnection(this.configuration.GetConnectionString("DefaultConnection"));

            // Converte a lista de caminhos de arquivos em texto JSON
            var jsonImages = JsonSerializer.Serialize(imagePaths);

            var sql = "UPDATE propriedade SET ImgUrls = @ImgUrls WHERE Id = @Id";
            var rowsAffected = await connection.ExecuteAsync(sql, new { ImgUrls = jsonImages, Id = propriedadeId });

            return rowsAffected > 0;
        }

        public async Task<IEnumerable<Propriedade>> GetAllPropriedade()
        {
            using (var con = new SqlConnection(getConnection))
            {
                var sql = @" SELECT p.*, t.*, s.* FROM propriedade p LEFT JOIN PropriedadeTipo t ON p.TypeId = t.Id LEFT JOIN PropriedadeStatus s ON p.StatusId = s.Id";

                var propriedades = await con.QueryAsync<Propriedade, PropriedadeTipo, PropriedadeStatus, Propriedade>(
                    sql,
                    (propriedade, tipo, status) =>
                    {
                        propriedade.Tipo = tipo;
                        propriedade.Status = status;
                        return propriedade;
                    },
                    splitOn: "Id,Id" // Divide o mapeamento entre as tabelas pelas colunas Id
                );

                return propriedades;
            }
        }

        public async Task<IEnumerable<Propriedade>> UpdatePropriedade(Propriedade propriedade)
        {
            using var connection = new SqlConnection(getConnection);

            // Buscar a propriedade atual para comparar as imagens
            var propriedadeAtual = await GetPropriedadeById(propriedade.Id);

            // Se a propriedade tem imagens existentes e a nova lista é diferente
            if (propriedadeAtual?.ImagensList != null && propriedade.ImagensList != null)
            {
                // Identificar imagens que foram removidas
                var imagensRemovidas = propriedadeAtual.ImagensList
                    .Where(img => !propriedade.ImagensList.Contains(img))
                    .ToList();

                // Excluir fisicamente as imagens removidas
                foreach (var imagemPath in imagensRemovidas)
                {
                    var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", imagemPath.TrimStart('/'));
                    if (System.IO.File.Exists(fullPath))
                    {
                        try
                        {
                            System.IO.File.Delete(fullPath);
                        }
                        catch (Exception ex)
                        {
                            // Log do erro, mas continua o processo
                            Console.WriteLine($"Erro ao deletar arquivo {fullPath}: {ex.Message}");
                        }
                    }
                }
            }

            // Se a propriedade tiver a lista ImagensList preenchida, converte para JSON string
            if (propriedade.ImagensList != null)
            {
                propriedade.ImgUrls = JsonSerializer.Serialize(propriedade.ImagensList);
            }
            else if (string.IsNullOrEmpty(propriedade.ImgUrls))
            {
                propriedade.ImgUrls = "[]";
            }

            var sql = @"UPDATE propriedade SET 
        Name = @Name, 
        Descricao = @Descricao, 
        Preco = @Preco, 
        Telefone = @Telefone, 
        Email = @Email, 
        Contacto = @Contacto, 
        Quarto = @Quarto, 
        Quintal = @Quintal, 
        Garagem = @Garagem, 
        Localizacao = @Localizacao, 
        Provincia = @Provincia, 
        Estado = @Estado, 
        Regiao = @Regiao, 
        UserId = @UserId, 
        TypeId = @TypeId, 
        StatusId = @StatusId,
        ImgUrls = @ImgUrls
        WHERE Id = @Id";

            await connection.ExecuteAsync(sql, propriedade);
            return await GetAllPropriedade();
        }

        public async Task<bool> DeletePropriedade(int propriedadeId)
        {
            using var connection = new SqlConnection(getConnection);

            // 1. Buscar as imagens da propriedade antes de eliminá-la
            var sqlGet = @"
        SELECT ImgUrls
        FROM propriedade
        WHERE Id = @Id";

            var imgUrls = await connection.QueryFirstOrDefaultAsync<string>(
                sqlGet,
                new { Id = propriedadeId }
            );

            if (imgUrls == null)
            {
                return false;
            }

            // 2. Converter o JSON das imagens para uma lista
            List<string> imagens = new List<string>();

            if (!string.IsNullOrWhiteSpace(imgUrls))
            {
                try
                {
                    imagens = JsonSerializer.Deserialize<List<string>>(imgUrls)
                              ?? new List<string>();
                }
                catch (JsonException ex)
                {
                    Console.WriteLine(
                        $"⚠️ Erro ao ler ImgUrls da propriedade {propriedadeId}: {ex.Message}"
                    );
                }
            }

            // 3. Eliminar a propriedade da base de dados
            var sqlDelete = @"
        DELETE FROM propriedade
        WHERE Id = @Id";

            var rowsAffected = await connection.ExecuteAsync(
                sqlDelete,
                new { Id = propriedadeId }
            );

            // Se não conseguiu eliminar a propriedade,
            // não elimina os ficheiros
            if (rowsAffected == 0)
            {
                return false;
            }

            // 4. Depois de eliminar a propriedade,
            // eliminar fisicamente as imagens
            foreach (var imagePath in imagens)
            {
                if (string.IsNullOrWhiteSpace(imagePath))
                    continue;

                try
                {
                    // Exemplo:
                    // /imoveis/1-12-08-2026-16-15.jpg
                    //
                    // transforma em:
                    // wwwroot/imoveis/1-12-08-2026-16-15.jpg

                    var relativePath = imagePath.TrimStart('/', '\\');

                    var fullPath = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot",
                        relativePath
                    );

                    Console.WriteLine($"🗑️ Tentando eliminar imagem: {fullPath}");

                    if (System.IO.File.Exists(fullPath))
                    {
                        System.IO.File.Delete(fullPath);

                        Console.WriteLine(
                            $"✅ Imagem eliminada: {fullPath}"
                        );
                    }
                    else
                    {
                        Console.WriteLine(
                            $"⚠️ Imagem não encontrada: {fullPath}"
                        );
                    }
                }
                catch (Exception ex)
                {
                    // A propriedade já foi eliminada.
                    // Apenas registamos o erro da imagem.
                    Console.WriteLine(
                        $"❌ Erro ao eliminar imagem '{imagePath}': {ex.Message}"
                    );
                }
            }

            Console.WriteLine(
                $"✅ Propriedade {propriedadeId} eliminada com sucesso."
            );

            return true;
        }

        public async Task<IEnumerable<Propriedade>> GetPropriedadesByLocatarioId(int locatarioId)
        {
            using var connection = new SqlConnection(getConnection);

            var sql = @"
        SELECT p.*, t.*, s.* 
        FROM propriedade p 
        LEFT JOIN PropriedadeTipo t ON p.TypeId = t.Id 
        LEFT JOIN PropriedadeStatus s ON p.StatusId = s.Id
        WHERE p.LocatarioId = @LocatarioId";

            var propriedades = await connection.QueryAsync<Propriedade, PropriedadeTipo, PropriedadeStatus, Propriedade>(
                sql,
                (propriedade, tipo, status) =>
                {
                    propriedade.Tipo = tipo;
                    propriedade.Status = status;
                    return propriedade;
                },
                new { LocatarioId = locatarioId },
                splitOn: "Id,Id"
            );

            return propriedades;
        }

        public async Task<IEnumerable<Propriedade>> GetAllPropriedadeDisponivel()
        {
            using (var con = new SqlConnection(getConnection))
            {
                var sql = @"
            SELECT p.*, t.*, s.* 
            FROM propriedade p 
            LEFT JOIN PropriedadeTipo t ON p.TypeId = t.Id 
            LEFT JOIN PropriedadeStatus s ON p.StatusId = s.Id
            WHERE s.Value = @Status";

                var propriedades = await con.QueryAsync<Propriedade, PropriedadeTipo, PropriedadeStatus, Propriedade>(
                    sql,
                    (propriedade, tipo, status) =>
                    {
                        propriedade.Tipo = tipo;
                        propriedade.Status = status;
                        return propriedade;
                    },
                    new { Status = "Disponível" },
                    splitOn: "Id,Id"
                );

                return propriedades;
            }
        }
    }
}
