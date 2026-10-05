using CrudDAPPER.Models;
using System.Data.SqlClient;
using Dapper;

namespace CrudDAPPER.Services.PropriedadeService
{
    public class PropriedadeStatusService : IPropriedadeStatusInterface
    {
        private readonly IConfiguration configuration;
        private readonly string? getConnection;
        public PropriedadeStatusService(IConfiguration configuration)
        {
            this.configuration = configuration;
            getConnection = this.configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<PropriedadeStatus> GetPropriedadeById(int propriedadeStatusId)
        {
            using (var con = new SqlConnection(getConnection))
            {
                var sql = "select * from propriedadeStatus where id = @Id";
                return await con.QueryFirstOrDefaultAsync<PropriedadeStatus>(sql, new { Id = propriedadeStatusId });
            }
        }
    }
}
