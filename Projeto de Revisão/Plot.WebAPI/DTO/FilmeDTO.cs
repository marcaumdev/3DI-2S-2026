using System.ComponentModel.DataAnnotations;

namespace Plot.WebAPI.DTO
{
    public class FilmeDTO : IValidatableObject
    {
        [Required(ErrorMessage = "O titulo do filme é obrigatório.")]
        [StringLength(100)]
        public string Titulo { get; set; } = string.Empty;

        [Required(ErrorMessage = "A sinopse é obrigatória.")]
        public string Sinopse { get; set; } = string.Empty;
        public DateOnly DataLancamento { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "A duração deve ser positiva.")]
        public int Duracao { get; set; }
        public string? ImagemCapa { get; set; }
        public IFormFile? ArquivoImagem { get; set; }
        public List<int> IdGeneros { get; set; } = new();

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if(ArquivoImagem is not null && !string.IsNullOrWhiteSpace(ImagemCapa)){
                yield return new ValidationResult(
                    "Envie ArquivoImagem ou ImagemCapa, não os dois.",
                    new[] { nameof(ArquivoImagem), nameof(ImagemCapa) });
            }

            if(DataLancamento.Year < 1888 || DataLancamento.Year > DateTime.UtcNow.Year)
            {
                yield return new ValidationResult(
                    "O ano de lançamento deve estar entre 1888 e o ano atual.",
                    new[] { nameof(DataLancamento)}
                    );
            }
        }
    }
}
