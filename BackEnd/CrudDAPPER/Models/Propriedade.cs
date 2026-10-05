using System.Text.Json.Serialization;
using System.Text.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace CrudDAPPER.Models
{
    public class Propriedade
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public decimal Preco { get; set; } // Use decimal para dinheiro!
        public int Telefone { get; set; }
        public string? Email { get; set; }
        public string? Contacto { get; set; }
        public int Quarto { get; set; }
        public int Quintal { get; set; }
        public int Garagem { get; set; }
        public string? Localizacao { get; set; }
        public string? Provincia { get; set; }
        public string? Estado { get; set; }
        public string? Regiao { get; set; }

        // Mapeia diretamente a coluna NVARCHAR(MAX) no Banco de Dados
        [JsonIgnore]
        public string? ImgUrls { get; set; }

        // Chaves Estrangeiras
        public int UserId { get; set; }
        public int TypeId { get; set; }
        public int StatusId { get; set; }

        // Propriedades de navegação (Opcional, usado para facilitar no C#)
        // O Dapper não mapeia isso automaticamente sem configuração, 
        // mas é útil ter no modelo.
        public Usuario? Usuario { get; set; }
        public PropriedadeTipo? Tipo { get; set; }
        public PropriedadeStatus? Status { get; set; }

        // Propriedade utilitária para desserializar/serializar o JSON para a API
        public List<string> ImagensList
        {
            get => string.IsNullOrEmpty(ImgUrls)
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(ImgUrls) ?? new List<string>();

            set => ImgUrls = JsonSerializer.Serialize(value);
        }

        public int? LocatarioId { get; set; }
    }
}
