using Plot.WebAPI.Models;

namespace Plot.WebAPI.Interfaces;

public interface IFilmeRepository
{
    Task Cadastrar(Filme filme);
    Task Atualizar(int id, Filme filme);
    Task Excluir(int id);
    Task<Filme?> BuscarPorId(int id);
    Task<(List<Filme> filmes, int total)> ListarPaginado(int pagina = 1, int tamanhoPagina = 10, string? busca = null);
}
