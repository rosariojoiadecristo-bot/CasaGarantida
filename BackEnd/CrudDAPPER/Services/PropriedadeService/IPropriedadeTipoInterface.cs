using CrudDAPPER.Models;

namespace CrudDAPPER.Services.PropriedadeService
{
    public interface IPropriedadeTipoInterface
    {
        Task<PropriedadeTipo> GetPropriedadeById(int propriedadeTipoId);
    }
}
