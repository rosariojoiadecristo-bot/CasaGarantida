using CrudDAPPER.Services.PedidoService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CrudDAPPER.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PedidoController : ControllerBase
    {
        private readonly IPedidoInterface pedidoInterface;

        public PedidoController(
            IPedidoInterface pedidoInterface)
        {
            this.pedidoInterface = pedidoInterface;
        }

        // ==========================================
        // CRIAR PEDIDO
        // ==========================================

        [HttpPost]
        public async Task<IActionResult> CriarPedido(
            [FromBody] CriarPedidoRequest request)
        {
            try
            {
                var pedido =
                    await pedidoInterface.CriarPedido(
                        request.PropriedadeId,
                        request.UsuarioId,
                        request.TipoPedido,
                        request.Observacao
                    );

                return Ok(new
                {
                    message =
                        "Pedido criado com sucesso. Aguarde a aprovação.",
                    pedido
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        // ==========================================
        // TODOS
        // ==========================================

        [HttpGet]
        public async Task<IActionResult> GetAllPedidos()
        {
            var pedidos =
                await pedidoInterface.GetAllPedidos();

            return Ok(pedidos);
        }

        // ==========================================
        // PENDENTES
        // ==========================================

        [HttpGet("pendentes")]
        public async Task<IActionResult> GetPedidosPendentes()
        {
            var pedidos =
                await pedidoInterface.GetPedidosPendentes();

            return Ok(pedidos);
        }

        // ==========================================
        // APROVAR
        // ==========================================

        [HttpPost("{id}/aprovar")]
        public async Task<IActionResult> AprovarPedido( int id, [FromBody] ProcessarPedidoRequest request)
        {
            try
            {
                var resultado = await pedidoInterface.AprovarPedido(
                    id,
                    request.ProcessadoPor,
                    request.Anos,
                    request.Meses,
                    request.Dias
                );

                if (!resultado)
                {
                    return BadRequest(new { message = "Não foi possível aprovar o pedido." });
                }

                return Ok(new
                {
                    message = "Pedido aprovado. O imóvel foi atualizado com sucesso."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ==========================================
        // REJEITAR
        // ==========================================

        [HttpPost("{id}/rejeitar")]
        public async Task<IActionResult> RejeitarPedido(
            int id,
            [FromBody] ProcessarPedidoRequest request)
        {
            try
            {
                var resultado =
                    await pedidoInterface.RejeitarPedido(
                        id,
                        request.ProcessadoPor,
                        request.Observacao
                    );

                if (!resultado)
                {
                    return BadRequest(
                        "Não foi possível rejeitar o pedido."
                    );
                }

                return Ok(new
                {
                    message =
                        "Pedido rejeitado com sucesso."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        // ==========================================
        // PENDENTES DE UM USUÁRIO ESPECÍFICO (contagem)
        // ==========================================

        [HttpGet("pendentes/usuario/{usuarioId}/total")]
        public async Task<IActionResult> GetTotalPedidosPendentesPorUsuario(int usuarioId)
        {
            try
            {
                var total = await pedidoInterface
                    .GetTotalPedidosPendentesPorUsuario(usuarioId);

                return Ok(new { total });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ==========================================
        // REJEITADOS DE UM USUÁRIO ESPECÍFICO (contagem)
        // ==========================================

        [HttpGet("rejeitados/usuario/{usuarioId}/total")]
        public async Task<IActionResult> GetTotalPedidosRejeitadoPorUsuario(int usuarioId)
        {
            try
            {
                var total = await pedidoInterface
                    .GetTotalPedidosRejeitadosPorUsuario(usuarioId);

                return Ok(new { total });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ==========================================
        // PENDENTES DE UM USUÁRIO ESPECÍFICO (lista)
        // ==========================================

        [HttpGet("pendentes/usuario/{usuarioId}")]
        public async Task<IActionResult> GetPedidosPendentesPorUsuario(int usuarioId)
        {
            try
            {
                var pedidos = await pedidoInterface
                    .GetPedidosPendentesPorUsuario(usuarioId);

                return Ok(pedidos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ==========================================
        // REJEITADOS DE UM USUÁRIO ESPECÍFICO (lista)
        // ==========================================

        [HttpGet("rejeitados/usuario/{usuarioId}")]
        public async Task<IActionResult> GetPedidosRejeitadosPorUsuario(int usuarioId)
        {
            try
            {
                var pedidos = await pedidoInterface
                    .GetPedidosRejeitadosPorUsuario(usuarioId);

                return Ok(pedidos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{id}/cancelar")]
        public async Task<IActionResult> CancelarPedido(
    int id,
    [FromBody] CancelarPedidoRequest request)
        {
            var resultado = await pedidoInterface.CancelarPedido(id, request.UsuarioId);

            if (!resultado)
            {
                return BadRequest(new
                {
                    message = "Não foi possível cancelar. O pedido pode já ter sido processado ou não lhe pertence."
                });
            }

            return Ok(new { message = "Pedido cancelado com sucesso." });
        }

        [HttpPost("{id}/cancelarRejeitado")]
        public async Task<IActionResult> CancelarPedidoRejeitado( int id, [FromBody] CancelarPedidoRequest request)
        {
            var resultado = await pedidoInterface.CancelarPedidoRejeitado(id, request.UsuarioId);

            if (!resultado)
            {
                return BadRequest(new
                {
                    message = "Não foi possível cancelar. O pedido pode já ter sido processado ou não lhe pertence."
                });
            }

            return Ok(new { message = "Pedido cancelado com sucesso." });
        }

        // ==========================================
        // POR ID
        // ==========================================

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPedidoById(int id)
        {
            var pedido =
                await pedidoInterface.GetPedidoById(id);

            if (pedido == null)
            {
                return NotFound(
                    "Pedido não encontrado."
                );
            }

            return Ok(pedido);
        }
    }



    // ==========================================
    // DTOs
    // ==========================================

    public class CriarPedidoRequest
    {
        public int PropriedadeId { get; set; }

        public int UsuarioId { get; set; }

        public string TipoPedido { get; set; } = string.Empty;

        public string? Observacao { get; set; }
    }

    public class ProcessarPedidoRequest
    {
        public int ProcessadoPor { get; set; }

        public string? Observacao { get; set; }

        public int? Anos { get; set; }
        public int? Meses { get; set; }
        public int? Dias { get; set; }
    }

    public class CancelarPedidoRequest
    {
        public int UsuarioId { get; set; }
    }
}
