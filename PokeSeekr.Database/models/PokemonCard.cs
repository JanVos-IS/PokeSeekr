using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace PokeSeekr.Database.models;

public partial class PokemonCard
{
    public int PokemonCardId { get; set; }

    public string TcgId { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Supertype { get; set; }

    public string? Level { get; set; }

    public string? Hp { get; set; }

    public string? EvolvesFrom { get; set; }

    public string Number { get; set; } = null!;

    public string? Artist { get; set; }

    public string? Rarity { get; set; }

    public string? FlavorText { get; set; }

    public string? ImageSmall { get; set; }

    public string? ImageLarge { get; set; }

    public bool? Downloaded { get; set; }

    [Column(TypeName = "vector(3)")]
    public Pgvector.Vector? AverageColor { get; set; }
    
    public int? SetId { get; set; }
    
    public virtual Set? Set { get; set; }

    // Additional properties from PokemonTcgSdk
    public string? EvolvesTo { get; set; }
    
    public string? RegulationMark { get; set; }
    
    [Column(TypeName = "jsonb")]
    public string? Types { get; set; }
    
    [Column(TypeName = "jsonb")]
    public string? Subtypes { get; set; }
    
    [Column(TypeName = "jsonb")]
    public string? Rules { get; set; }
    
    [Column(TypeName = "jsonb")]
    public string? Legalities { get; set; }
    
    [Column(TypeName = "jsonb")]
    public string? Attacks { get; set; }
    
    [Column(TypeName = "jsonb")]
    public string? Weaknesses { get; set; }
    
    [Column(TypeName = "jsonb")]
    public string? Resistances { get; set; }
    
    [Column(TypeName = "jsonb")]
    public string? Abilities { get; set; }
    
    public string? TcgUrl { get; set; }
    
    public string? CardMarket { get; set; }
    
    public double? TcgPlayerPriceNormal { get; set; }
    
    public double? TcgPlayerPriceHolofoil { get; set; }
    
    public double? CardMarketPrice { get; set; }
}
