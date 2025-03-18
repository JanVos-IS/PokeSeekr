using System;
using System.Collections.Generic;

namespace PokeSeekr.Database.models;

public partial class Set
{
    public int SetId { get; set; }
    public string TcgId { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Series { get; set; }
    public int? PrintedTotal { get; set; }
    public int? Total { get; set; }
    public string? ReleaseDate { get; set; }
    public string? LogoUrl { get; set; }
    public string? SymbolUrl { get; set; }
    
    public virtual ICollection<PokemonCard> PokemonCards { get; set; } = new List<PokemonCard>();
} 