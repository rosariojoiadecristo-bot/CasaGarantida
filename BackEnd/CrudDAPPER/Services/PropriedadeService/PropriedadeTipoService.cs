using CrudDAPPER.Models;
using System.Data.SqlClient;
using Dapper;

namespace CrudDAPPER.Services.PropriedadeService
{
    public class PropriedadeTipoService : IPropriedadeTipoInterface
    {
        private readonly IConfiguration configuration;
        private readonly string? getConnection;
        public PropriedadeTipoService(IConfiguration configuration)
        {
            this.configuration = configuration;
            getConnection = this.configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<PropriedadeTipo> GetPropriedadeById(int propriedadeTipoId)
        {
            using (var con = new SqlConnection(getConnection))
            {
                var sql = "select * from propriedadeTipo where id = @Id";
                return await con.QueryFirstOrDefaultAsync<PropriedadeTipo>(sql, new { Id = propriedadeTipoId });
            }
        }
    }
}
