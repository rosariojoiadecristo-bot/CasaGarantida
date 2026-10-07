using CrudDAPPER.Models;
using CrudDAPPER.Services.UsuarioService;
using Dapper;
using System.Data.SqlClient;

namespace CrudDAPPER.Services.LivroService
{
    public class UsuarioService : IUsuarioInterface
    {
        private readonly IConfiguration configuration;
        private readonly string? getConnection;
        public UsuarioService(IConfiguration configuration)
        {
            this.configuration = configuration;
            getConnection = this.configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IEnumerable<Usuario>> CreateUsuario(Usuario usuario)
        {
            using (var con = new SqlConnection(getConnection))
            {
                // Garante que se vier vazio/zero, assume 3 (Cliente)
                if (usuario.TipoUsuarioId == 0)
                {
                    usuario.TipoUsuarioId = 3;
                }

                var sql = @"insert into usuarios (firstName, lastName, email, avatarUrl, tipoUsuarioId) 
                    values (@firstName, @lastName, @email, @avatarUrl, @tipoUsuarioId);
                    SELECT CAST(SCOPE_IDENTITY() as int)";

                usuario.Id = await con.ExecuteScalarAsync<int>(sql, usuario);

                return new List<Usuario> { usuario };
            }
        }

        public async Task<IEnumerable<Usuario>> DeleteUsuario(int usuarioId)
        {
            using (var con = new SqlConnection(getConnection))
            {
                var sql = "delete from usuarios where id = @Id";
                await con.ExecuteAsync(sql, new { Id = usuarioId });
                return await con.QueryAsync<Usuario>("select * from usuarios");
            }
        }

        public async Task<IEnumerable<Usuario>> GetAllUsuarios()
        {
            using(var con = new SqlConnection(getConnection))
            {
                var sql = "select * from usuarios";
                return await con.QueryAsync<Usuario>(sql);
            }
        }

        public async Task<Usuario> GetUsuarioById(int usuarioId)
        {
            using(var con = new SqlConnection(getConnection))
            {
                var sql = "select * from usuarios where id = @Id";
                return await con.QueryFirstOrDefaultAsync<Usuario>(sql, new {Id = usuarioId});
            }
        }

        public async Task<Usuario> GetUsuarioByEmail(string email)
        {
            using var connection = new SqlConnection(getConnection);
            var query = "SELECT * FROM usuarios WHERE Email = @Email";
            return await connection.QueryFirstOrDefaultAsync<Usuario>(query, new { Email = email });
        }

        public async Task<IEnumerable<Usuario>> UpdateUsuario(Usuario usuario)
        {
            using (var con = new SqlConnection(getConnection))
            {
                var sql = "update usuarios set firstName = @firstName, lastName = @lastName, email = @email, avatarUrl = @avatarUrl where id = @Id";
                await con.ExecuteAsync(sql, usuario);
                return await con.QueryAsync<Usuario>("select * from usuarios");
            }
        }

        public async Task<bool> AtualizarPerfil(int usuarioId, Usuario usuario)
        {
            using (var con = new SqlConnection(getConnection))
            {
                var sql = @"UPDATE usuarios SET firstName = @firstName, lastName = @lastName, contacto1 = @contacto1, contacto2 = @contacto2, provincia = @provincia WHERE Id = @Id";

                var parametros = new
                {
                    Id = usuarioId,
                    usuario.firstName,
                    usuario.lastName,
                    usuario.contacto1,
                    usuario.contacto2,
                    usuario.provincia
                };

                var linhasAfetadas = await con.ExecuteAsync(sql, parametros);

                return linhasAfetadas > 0;
            }
        }

        public async Task<bool> AtualizarTipoUsuario(int usuarioId, int novoTipoUsuarioId)
        {
            using (var con = new SqlConnection(getConnection))
            {
                // Só permite tipos válidos: 1 = Administrador, 2 = Gestor, 3 = Cliente
                if (novoTipoUsuarioId < 1 || novoTipoUsuarioId > 3)
                {
                    return false;
                }

                var sql = @"UPDATE usuarios 
                    SET tipoUsuarioId = @TipoUsuarioId 
                    WHERE Id = @Id";

                var linhasAfetadas = await con.ExecuteAsync(sql, new
                {
                    Id = usuarioId,
                    TipoUsuarioId = novoTipoUsuarioId
                });

                return linhasAfetadas > 0;
            }
        }
    }
}
