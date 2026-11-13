using System.ComponentModel.DataAnnotations;

namespace Plot.WebAPI.DTO;

public class UsuarioAtualizacaoDTO : IValidatableObject
{
    [Required, StringLength(100)]
    public string Nome { get; set; } = string.Empty;

    [Required, EmailAddress, StringLength(50)]
    public string Email { get; set; } = string.Empty;

    [MinLength(8)]
    public string? Senha { get; set; }
    public string? FotoPerfil { get; set; }

    public IFormFile? ArquivoImagem { get; set; }
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (ArquivoImagem is not null && !string.IsNullOrWhiteSpace(FotoPerfil))
            yield return new ValidationResult(
                "Envie ArquivoImagem ou FotoPerfil, não os dois.",
                new[] { nameof(ArquivoImagem), nameof(FotoPerfil) });
    }
}
