using System.ComponentModel.DataAnnotations;

namespace Plot.WebAPI.DTO;

public class GeneroDTO
{
    [Required(ErrorMessage = "O nome do gênero é obrigatório.")]
    [StringLength(50)]
    public string Nome { get; set; } = string.Empty;
}
