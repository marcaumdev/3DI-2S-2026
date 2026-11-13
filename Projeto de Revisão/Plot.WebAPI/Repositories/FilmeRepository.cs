using Microsoft.EntityFrameworkCore;
using Plot.WebAPI.Context;
using Plot.WebAPI.Interfaces;
using Plot.WebAPI.Models;

namespace Plot.WebAPI.Repositories;

public class FilmeRepository : IFilmeRepository
{
    private readonly PlotDbContext _context;

    public FilmeRepository(PlotDbContext context)
    {
        _context = context;
    }
    public async Task Atualizar(int id, Filme filme)
    {
        var filmeExistente = await _context.Filme.Include(f => f.IdGenero).FirstOrDefaultAsync(f => f.IdFilme == id);

        if(filmeExistente != null)
        {
            filmeExistente.Titulo = filme.Titulo;
            filmeExistente.Sinopse = filme.Sinopse;
            filmeExistente.Duracao = filme.Duracao;
            filmeExistente.DataLancamento = filme.DataLancamento;
            filmeExistente.ImagemCapa = filme.ImagemCapa;
            filmeExistente.IdGenero = filme.IdGenero;

            await _context.SaveChangesAsync();
        }
    }

    public async Task<Filme?> BuscarPorId(int id)
    {
        return await _context.Filme.AsNoTracking().Include(f => f.IdGenero).FirstOrDefaultAsync(f => f.IdFilme == id);
    }

    public async Task Cadastrar(Filme filme)
    {
        await _context.Filme.AddAsync(filme);
        await _context.SaveChangesAsync();
    }

    public async Task Excluir(int id)
    {
        var filmeBuscado = await _context.Filme.FirstOrDefaultAsync(f => f.IdFilme == id);
        if(filmeBuscado != null)
        {
            _context.Filme.Remove(filmeBuscado);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<(List<Filme> filmes, int total)> ListarPaginado(int pagina = 1, int tamanhoPagina = 10, string? busca = null)
    {
        var query = _context.Filme.AsNoTracking().Include(f => f.IdGenero).AsQueryable();

        if (!string.IsNullOrWhiteSpace(busca))
        {
            query = query.Where(f => f.Titulo.Contains(busca));
        }

        int total = await query.CountAsync();

        var items = await query
            .OrderBy(f => f.Titulo).ThenBy(f => f.IdFilme)
            .Skip((pagina - 1) * tamanhoPagina)
            .Take(tamanhoPagina)
            .ToListAsync();

        return (items, total);
    }
}
