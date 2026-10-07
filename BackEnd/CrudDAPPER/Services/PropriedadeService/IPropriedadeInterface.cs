using CrudDAPPER.Models;

namespace CrudDAPPER.Services.PropriedadeService
{
    public interface IPropriedadeInterface
    {
        Task<IEnumerable<Propriedade>> GetAllPropriedade();
        Task<Propriedade?> GetPropriedadeById(int id);
        Task<bool> SaveImages(int propriedadeId, List<string> imagePaths);
        Task<IEnumerable<Propriedade>> CreatePropriedade(Propriedade propriedade);
        Task<IEnumerable<Propriedade>> UpdatePropriedade(Propriedade propriedade);
        Task<bool> DeletePropriedade(int propriedadeId);
        Task<IEnumerable<Propriedade>> GetPropriedadesByLocatarioId(int locatarioId);
        Task<IEnumerable<Propriedade>> GetAllPropriedadeDisponivel();
    }
}
