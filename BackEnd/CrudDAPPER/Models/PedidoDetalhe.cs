namespace CrudDAPPER.Models
{
    public class PedidoDetalhe
    {
        public int Id { get; set; }

        public int PropriedadeId { get; set; }

        public string? PropriedadeNome { get; set; }

        public int UsuarioId { get; set; }

        public string? UsuarioNome { get; set; }

        public string? UsuarioEmail { get; set; }

        public int TipoId { get; set; }

        public string? TipoPedido { get; set; }

        public int StatusId { get; set; }

        public string? StatusPedido { get; set; }

        public DateTime DataPedido { get; set; }

        public DateTime? DataDecisao { get; set; }

        public int? ProcessadoPor { get; set; }

        public string? Observacao { get; set; }

        public DateTime? DataFimContrato { get; set; }
        public int? UsuarioContratoId { get; set; }
    }
}
