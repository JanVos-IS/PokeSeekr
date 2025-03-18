using System;
using System.ComponentModel.DataAnnotations;

namespace PokeSeekr.Database.models;

public partial class Rarity
{
    public int RarityId { get; set; }

    [Required]
    public string Name { get; set; } = null!;
} 