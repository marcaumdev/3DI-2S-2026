using Microsoft.EntityFrameworkCore;
using Plot.WebAPI.Context;
using Plot.WebAPI.Interfaces;
using Plot.WebAPI.Models;

namespace Plot.WebAPI.Repositories;

public class GeneroRepository : IGeneroRepository
{
    private readonly PlotDbContext _context;

    public GeneroRepository(PlotDbContext context)
    {
        _context = context;
    }
    public async Task Atualizar(int id, Genero genero)
    {
        var generoExistente = await _context.Genero.FindAsync(id);
        if(generoExistente != null)
        {
            generoExistente.Nome = genero.Nome;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<Genero?> BuscarPorId(int id)
    {
        return await _context.Genero.AsNoTracking().FirstOrDefaultAsync(g => g.IdGenero == id);
    }

    public Task<List<Genero>> BuscarPorIds(IReadOnlyCollection<int> ids)
    {
        var idsArray = ids.ToArray();
        return _context.Genero.Where(g => idsArray.Contains(g.IdGenero)).ToListAsync();
    }

    public async Task Cadastrar(Genero genero)
    {
        await _context.Genero.AddAsync(genero);
        await _context.SaveChangesAsync();
    }

    public async Task Excluir(int id)
    {
        var generoBuscado = await _context.Genero.FindAsync(id);
        if(generoBuscado != null)
        {
            _context.Genero.Remove(generoBuscado);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<List<Genero>> Listar()
    {
        return await _context.Genero.AsNoTracking().OrderBy(g => g.Nome).ToListAsync();
    }
}
