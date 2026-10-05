using CrudDAPPER.Models;

namespace CrudDAPPER.Services.PropriedadeService
{
    public interface IPropriedadeStatusInterface
    {
        Task<PropriedadeStatus> GetPropriedadeById(int propriedadeStatusId);
    }
}
