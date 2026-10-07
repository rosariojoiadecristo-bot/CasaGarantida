using CrudDAPPER.Models;
using CrudDAPPER.Services.PropriedadeService;
using Microsoft.AspNetCore.Mvc;

namespace CrudDAPPER.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropriedadeController : ControllerBase
    {
        private readonly IPropriedadeInterface propriedadeInterface;
        public PropriedadeController(IPropriedadeInterface propriedadeInterface)
        {
            this.propriedadeInterface = propriedadeInterface;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Propriedade>>> GetAllPropriedade()
        {
            IEnumerable<Propriedade> propriedades = await this.propriedadeInterface.GetAllPropriedade();

            if (!propriedades.Any())
            {
                return NotFound("Nenhuma propriedade localizada");
            }

            return Ok(propriedades);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Propriedade>> GetPropriedadeById(int id)
        {
            Propriedade propriedade = await this.propriedadeInterface.GetPropriedadeById(id);

            if (propriedade == null)
            {
                return NotFound("Nenhuma propriedade localizada");
            }

            return Ok(propriedade);
        }

        [HttpPost]
        public async Task<ActionResult<IEnumerable<Propriedade>>> CreatePropriedade([FromBody] Propriedade propriedade)
        {
            var propriedades = await this.propriedadeInterface.CreatePropriedade(propriedade);
            return Ok(propriedades);
        }

        // NOVO MÉTODO PUT
        [HttpPut("{id}")]
        public async Task<ActionResult<IEnumerable<Propriedade>>> UpdatePropriedade(int id, [FromBody] Propriedade propriedade)
        {
            var propriedadeExistente = await this.propriedadeInterface.GetPropriedadeById(id);
            if (propriedadeExistente == null)
            {
                return NotFound("Propriedade não encontrada.");
            }

            propriedade.Id = id; // Garante que o ID da rota seja atribuído ao objeto
            var propriedadesAtualizadas = await this.propriedadeInterface.UpdatePropriedade(propriedade);

            return Ok(propriedadesAtualizadas);
        }

        [HttpPost("upload-images")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadImages([FromForm] List<IFormFile> files, [FromForm] int propriedadeId)
        {
            if (files == null || files.Count == 0)
                return BadRequest("Nenhum ficheiro foi enviado.");

            var propriedade = await this.propriedadeInterface.GetPropriedadeById(propriedadeId);
            if (propriedade == null)
                return NotFound("Propriedade não encontrada.");

            // Obter os caminhos já existentes na propriedade
            var imagePaths = propriedade.ImagensList;

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "imoveis");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            // Data/Hora atual no formato solicitado (dia-mês-ano)
            var timestamp = DateTime.Now.ToString("dd-MM-yyyy-HH-mm");

            for (int i = 0; i < files.Count; i++)
            {
                var file = files[i];

                if (file.Length > 0)
                {
                    // Posição baseada no índice do loop (1, 2, 3...)
                    int posicao = i + 1;

                    // Extensão original do arquivo (.jpg, .png, etc)
                    var extension = Path.GetExtension(file.FileName);

                    // Exemplo de resultado: 1-12-08-2026-16-15.jpg
                    var fileName = $"{posicao}-{timestamp}{extension}";
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    imagePaths.Add($"/imoveis/{fileName}");
                }
            }

            // Grava o array JSON no campo ImgUrls do banco de dados
            await this.propriedadeInterface.SaveImages(propriedadeId, imagePaths);

            return Ok(new { propriedadeId = propriedadeId, imagens = imagePaths });
        }

        [HttpPost("{propriedadeId}/remove-image")]
        public async Task<IActionResult> RemoveImage(int propriedadeId, [FromBody] string imagePath)
        {
            try
            {
                Console.WriteLine($"🗑️ Tentando deletar imagem: {imagePath} da propriedade {propriedadeId}");

                var propriedade = await this.propriedadeInterface.GetPropriedadeById(propriedadeId);
                if (propriedade == null)
                {
                    Console.WriteLine($"❌ Propriedade {propriedadeId} não encontrada");
                    return NotFound("Propriedade não encontrada.");
                }

                // Verifica se a imagem existe na lista
                if (!propriedade.ImagensList.Contains(imagePath))
                {
                    Console.WriteLine($"❌ Imagem {imagePath} não encontrada na lista");
                    return BadRequest("Imagem não encontrada na lista.");
                }

                // Remove da lista
                propriedade.ImagensList.Remove(imagePath);

                // Exclui fisicamente o arquivo
                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", imagePath.TrimStart('/'));
                Console.WriteLine($"📁 Tentando excluir arquivo: {fullPath}");

                if (System.IO.File.Exists(fullPath))
                {
                    try
                    {
                        System.IO.File.Delete(fullPath);
                        Console.WriteLine($"✅ Arquivo excluído com sucesso: {fullPath}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"❌ Erro ao excluir arquivo: {ex.Message}");
                        // Continua mesmo se não conseguir excluir o arquivo
                    }
                }
                else
                {
                    Console.WriteLine($"⚠️ Arquivo não encontrado: {fullPath}");
                }

                // Atualiza a lista no banco de dados
                await this.propriedadeInterface.SaveImages(propriedadeId, propriedade.ImagensList);
                Console.WriteLine($"💾 Lista atualizada no banco. Total de imagens: {propriedade.ImagensList.Count}");

                return Ok(new
                {
                    message = "Imagem removida com sucesso.",
                    remainingImages = propriedade.ImagensList
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro ao remover imagem: {ex.Message}");
                return StatusCode(500, $"Erro ao remover imagem: {ex.Message}");
            }
        }

        [HttpGet("disponiveis")]
        public async Task<ActionResult<IEnumerable<Propriedade>>> GetAllPropriedadeDisponivel()
        {
            IEnumerable<Propriedade> propriedades = await this.propriedadeInterface.GetAllPropriedadeDisponivel();

            if (!propriedades.Any())
            {
                return NotFound("Nenhuma propriedade disponível localizada");
            }

            return Ok(propriedades);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePropriedade(int id)
        {
            try
            {
                var propriedade = await propriedadeInterface.GetPropriedadeById(id);

                if (propriedade == null)
                {
                    return NotFound(new
                    {
                        message = "A propriedade não foi encontrada."
                    });
                }

                var deleted = await propriedadeInterface.DeletePropriedade(id);

                if (!deleted)
                {
                    return BadRequest(new
                    {
                        message = "Não foi possível eliminar a propriedade."
                    });
                }

                return Ok(new
                {
                    message = "Propriedade eliminada com sucesso.",
                    id
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    $"Erro ao eliminar propriedade {id}: {ex.Message}"
                );

                return StatusCode(500, new
                {
                    message = "Não foi possível eliminar a propriedade.",
                    error = ex.Message
                });
            }
        }

        [HttpGet("cliente/{clienteId}")]
        public async Task<ActionResult<IEnumerable<Propriedade>>> GetPropriedadesByCliente(int clienteId)
        {
            var propriedades = await this.propriedadeInterface.GetPropriedadesByLocatarioId(clienteId);

            if (!propriedades.Any())
            {
                return Ok(new List<Propriedade>()); // Retorna lista vazia 200 OK para evitar erro de fetch no Next.js
            }

            return Ok(propriedades);
        }
    }
}
