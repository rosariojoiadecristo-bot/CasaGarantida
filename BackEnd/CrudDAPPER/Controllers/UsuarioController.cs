using CrudDAPPER.Models;
using CrudDAPPER.Services.UsuarioService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CrudDAPPER.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioInterface usuarioInterface;
        public UsuarioController(IUsuarioInterface usuarioInterface)
        {
            this.usuarioInterface = usuarioInterface;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetAllLUsuarios()
        {
            IEnumerable<Usuario> usuarios = await this.usuarioInterface.GetAllUsuarios();

            if (!usuarios.Any())
            {
                return NotFound("Nenhum usuario localizado");
            }

            return Ok(usuarios);
        }

        [HttpGet("{usuarioId}")]
        public async Task<ActionResult<Usuario>> GetUsuarioById(int usuarioId)
        {
            Usuario usuario = await this.usuarioInterface.GetUsuarioById(usuarioId);

            if(usuario == null)
            {
                return NotFound("Nenhum usuario localizado");
            }

            return Ok(usuario);
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<Usuario>>> CreateUsuario(Usuario usuario)
        {
            IEnumerable<Usuario> usuarios = await this.usuarioInterface.CreateUsuario(usuario);

            return Ok(usuarios);
        }

        [HttpPut]
        public async Task<ActionResult<IEnumerable<Usuario>>> UpdateUsuario(Usuario usuario)
        {
            Usuario registro = await this.usuarioInterface.GetUsuarioById(usuario.Id);
            
            if(registro == null)
            {
                return NotFound("Nenhum usuario localizado");
            }

            IEnumerable<Usuario> usuarios = await this.usuarioInterface.UpdateUsuario(usuario);
            return Ok(usuarios);
        }

        [HttpDelete("{usuarioId}")]
        public async Task<ActionResult<IEnumerable<Usuario>>> DeleteUsuario(int usuarioId)
        {
            Usuario registro = await this.usuarioInterface.GetUsuarioById(usuarioId);

            if (registro == null)
            {
                return NotFound("Nenhum usuario localizado");
            }

            IEnumerable<Usuario> usuarios = await this.usuarioInterface.DeleteUsuario(usuarioId);
            return Ok(usuarios);
        }

        [HttpPost("sync")]
        public async Task<ActionResult> SyncUsuario([FromBody] Usuario usuario)
        {
            if (usuario == null || string.IsNullOrWhiteSpace(usuario.email))
            {
                return BadRequest("E-mail inválido ou não fornecido.");
            }

            // 1. Verifica se o usuário já existe pelo e-mail
            Usuario usuarioExistente = await this.usuarioInterface.GetUsuarioByEmail(usuario.email);

            // 2. Se não existir, insere no SQL Server
            if (usuarioExistente == null)
            {
                await this.usuarioInterface.CreateUsuario(usuario);
                return Ok(new { message = "Novo usuário cadastrado com sucesso." });
            }

            return Ok(new { message = "Usuário já existente na base de dados." });
        }

        [HttpGet("by-email")]
        public async Task<ActionResult<Usuario>> GetUsuarioByEmail([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest("E-mail não fornecido.");
            }

            Usuario usuario = await this.usuarioInterface.GetUsuarioByEmail(email);

            if (usuario == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            return Ok(usuario);
        }

        [HttpPost("upload-avatar-file")]
        public async Task<ActionResult> UploadAvatarFile([FromForm] IFormFile file, [FromForm] string email)
        {
            if (file == null || file.Length == 0) return BadRequest("Nenhum ficheiro enviado.");

            // Define o caminho: wwwroot/uploads
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            // Cria nome único e caminho
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            // Salva o ficheiro
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Salva o caminho relativo no SQL Server
            var relativePath = $"/uploads/{fileName}";
            var usuario = await this.usuarioInterface.GetUsuarioByEmail(email);

            if (usuario != null)
            {
                usuario.avatarUrl = relativePath;
                await this.usuarioInterface.UpdateUsuario(usuario);
            }

            return Ok(new { avatarUrl = relativePath });
        }
    }
}
