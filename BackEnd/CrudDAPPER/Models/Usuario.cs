namespace CrudDAPPER.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string firstName { get; set; } = string.Empty;
        public string lastName { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string avatarUrl { get; set; } = string.Empty;
        public int TipoUsuarioId { get; set; } = 3; // Padrão Cliente
    }
}
