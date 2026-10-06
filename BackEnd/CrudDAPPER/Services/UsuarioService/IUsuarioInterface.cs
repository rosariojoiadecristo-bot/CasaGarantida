using CrudDAPPER.Models;

namespace CrudDAPPER.Services.UsuarioService
{
    public interface IUsuarioInterface
    {
        Task<IEnumerable<Usuario>> GetAllUsuarios();
        Task<Usuario> GetUsuarioById(int usuarioId);
        Task<Usuario> GetUsuarioByEmail(string email); // <-- Novo método
        Task<IEnumerable<Usuario>> CreateUsuario(Usuario usuario);
        Task<IEnumerable<Usuario>> UpdateUsuario(Usuario usuario);
        Task<IEnumerable<Usuario>> DeleteUsuario(int usuarioId);
        Task<bool> AtualizarPerfil( int usuarioId, Usuario usuario );
    }
}
