namespace CrudDAPPER.Models
{
    public class Pedido
    {
        public int Id { get; set; }

        public int PropriedadeId { get; set; }

        public int UsuarioId { get; set; }

        public int TipoId { get; set; }

        public int StatusId { get; set; }

        public DateTime DataPedido { get; set; }

        public DateTime? DataDecisao { get; set; }

        public int? ProcessadoPor { get; set; }

        public string? Observacao { get; set; }
        public DateTime? DataFimContrato { get; set; }
        public int? UsuarioContratoId { get; set; }
    }
}
