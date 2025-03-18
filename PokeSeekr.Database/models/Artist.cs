using System;
using System.ComponentModel.DataAnnotations;

namespace PokeSeekr.Database.models;

public partial class Artist
{
    public int ArtistId { get; set; }

    [Required]
    public string Name { get; set; } = null!;
} 