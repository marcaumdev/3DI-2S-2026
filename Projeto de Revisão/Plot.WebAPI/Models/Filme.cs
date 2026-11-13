using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Plot.WebAPI.Models;

[Table("FILME")]
public partial class Filme
{
    [Key]
    public int IdFilme { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string Titulo { get; set; } = null!;

    [Unicode(false)]
    public string Sinopse { get; set; } = null!;

    public DateOnly DataLancamento { get; set; }

    public int Duracao { get; set; }

    [Unicode(false)]
    public string? ImagemCapa { get; set; }

    [ForeignKey("IdFilme")]
    [InverseProperty("IdFilme")]
    public virtual ICollection<Genero> IdGenero { get; set; } = new List<Genero>();
}
