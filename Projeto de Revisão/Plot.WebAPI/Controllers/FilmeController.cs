using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Plot.WebAPI.DTO;
using Plot.WebAPI.Interfaces;
using Plot.WebAPI.Models;
using Plot.WebAPI.Services;

namespace Plot.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilmeController : ControllerBase
    {
        private readonly IFilmeRepository _filmeRepository;
        private readonly IGeneroRepository _generoRepository;
        private readonly IImageService _imageService;

        public FilmeController(IFilmeRepository filmeRepository, IGeneroRepository generoRepository, IImageService imageService)
        {
            _filmeRepository = filmeRepository;
            _generoRepository = generoRepository;
            _imageService = imageService;
        }

        [HttpGet]
        public async Task<IActionResult> Lista([FromQuery] int pagina = 1, [FromQuery] int tamanhoPagina = 10, [FromQuery] string? busca = null) 
        {
            if (pagina < 1 || tamanhoPagina is < 1 or > 100)
                return BadRequest("Página deve ser positiva e o tamanhoPagina deve estar entre 1 e 100.");

            var (items, total) = await _filmeRepository.ListarPaginado(pagina, tamanhoPagina, busca);
            return Ok(new { items, total, pagina, tamanhoPagina });
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> BuscarPorId(int id)
        {
            var filme = await _filmeRepository.BuscarPorId(id);
            return filme is null ? NotFound() : Ok(filme);
        }

        [HttpPost]
        [Authorize]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(11 * 1024 * 1024)]
        public async Task<IActionResult> Cadastrar([FromForm] FilmeDTO dto)
        {
            var generos = await BuscarGeneros(dto.IdGeneros ?? new List<int>());
            if (generos is null) return BadRequest("Um ou mais IDs de gênero não existem.");

            if (dto.ArquivoImagem is not null && !_imageService.IsConfigured)
                return Problem("Configure as credenciais do Cloudinary para enviar imagens.", statusCode: 503);

            string? novaUrl = null;
            try
            {
                if (dto.ArquivoImagem is not null)
                    novaUrl = await _imageService.UploadImageAsync(dto.ArquivoImagem, ImageFolder.Filmes);
            }
            catch (ArgumentException erro) { return BadRequest(erro.Message); }
            catch(HttpRequestException) { return Problem("Falha ao enviar a capa ao Cloudinary.", statusCode: 502); }

            var imagem = string.IsNullOrWhiteSpace(dto.ImagemCapa) ? null : dto.ImagemCapa;

            var filme = Converter(dto, generos, novaUrl ?? imagem);

            try
            {
                await _filmeRepository.Cadastrar(filme);
            }
            catch
            {
                if(novaUrl is not null) await _imageService.DeleteImageAsync(novaUrl);
                throw;
            }

            return CreatedAtAction(nameof(BuscarPorId), new { id = filme.IdFilme }, filme);
        }

        [HttpPut("{id:int}")]
        [Authorize]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(11 * 1024 * 1024)]
        public async Task<IActionResult> Atualizar(int id, [FromForm] FilmeDTO dto)
        {
            var atual = await _filmeRepository.BuscarPorId(id);
            if (atual is null) return NotFound();

            var idsGeneros = dto.IdGeneros ?? atual.IdGenero.Select(g => g.IdGenero).ToList();
            var generos = await BuscarGeneros(idsGeneros);
            if (generos is null) return BadRequest("Um ou mais IDs de gênero não existem.");

            if (dto.ArquivoImagem is not null && !_imageService.IsConfigured)
                return Problem("Configure as credenciais do Cloudinary para enviar imagens.", statusCode: 503);

            string? novaUrl = null;
            try
            {
                if (dto.ArquivoImagem is not null)
                    novaUrl = await _imageService.UploadImageAsync(dto.ArquivoImagem, ImageFolder.Filmes);
            }
            catch(ArgumentException erro) { return BadRequest(erro.Message); }
            catch(HttpRequestException) { return Problem("Falha ao enviar a capa ao Cloudinary.", statusCode: 502); }

            var imagem = novaUrl ?? (string.IsNullOrWhiteSpace(dto.ImagemCapa) ? atual.ImagemCapa : dto.ImagemCapa);
            try
            {
                await _filmeRepository.Atualizar(id, Converter(dto, generos, imagem));
            }
            catch
            {
                if (novaUrl is not null) await _imageService.DeleteImageAsync(novaUrl);
                throw;
            }

            if (!string.IsNullOrWhiteSpace(atual.ImagemCapa) && atual.ImagemCapa != imagem)
                await _imageService.DeleteImageAsync(atual.ImagemCapa);
            return NoContent();

        }

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Excluir(int id)
        {
            var filme = await _filmeRepository.BuscarPorId(id);
            if (filme is null) return NotFound();
            await _filmeRepository.Excluir(id);
            if (!string.IsNullOrWhiteSpace(filme.ImagemCapa))
                await _imageService.DeleteImageAsync(filme.ImagemCapa);
            return NoContent();
        }

        private async Task<List<Genero>?> BuscarGeneros(List<int> ids)
        {
            var distintos = ids.Distinct().ToArray();
            var generos = await _generoRepository.BuscarPorIds(distintos);
            return generos.Count == distintos.Length ? generos : null;
        }

        private static Filme Converter(FilmeDTO dto, List<Genero> generos, string? imagemCapa) => new()
        {
            Titulo = dto.Titulo,
            Sinopse = dto.Sinopse,
            DataLancamento = dto.DataLancamento,
            Duracao = dto.Duracao,
            ImagemCapa = imagemCapa,
            IdGenero = generos
        };
    }
}
