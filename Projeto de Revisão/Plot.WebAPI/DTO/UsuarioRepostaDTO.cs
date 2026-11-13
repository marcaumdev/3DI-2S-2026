using Plot.WebAPI.Models;

namespace Plot.WebAPI.DTO;

public class UsuarioRepostaDTO(int IdUsuario, string Nome, string Email, string TipoUsuario, bool Ativo, string? FotoPerfil)
{
    public static UsuarioRepostaDTO Converter(Usuario usuario) => new(usuario.IdUsuario,
        usuario.Nome,
        usuario.Email,
        usuario.TipoUsuario,
        usuario.Ativo,
        usuario.FotoPerfil);
}
