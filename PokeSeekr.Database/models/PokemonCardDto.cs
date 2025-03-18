using Pgvector;
using PokeSeekr.API.Models;
using System.Text.Json.Serialization;

namespace PokeSeekr.Database.models
{
    public class PokemonCardDto
    {
        public int PokemonCardId { get; set; }
        public string? TcgId { get; set; }
        public string? Name { get; set; }
        public string? Supertype { get; set; }
        public string? Level { get; set; }
        public string? Hp { get; set; }
        public string? EvolvesFrom { get; set; }
        public string? Number { get; set; }
        public string? Artist { get; set; }
        public string? Rarity { get; set; }
        public string? FlavorText { get; set; }
        public string? ImageSmall { get; set; }
        public string? ImageLarge { get; set; }
        public bool? Downloaded { get; set; }
        
        [JsonConverter(typeof(VectorJsonConverter))]
        public Vector? AverageColor { get; set; }
        
        // Instead of including the full Set object, just include the name
        public string? SetName { get; set; }
        
        // Additional properties from PokemonTcgSdk
        public string? EvolvesTo { get; set; }
        public string? RegulationMark { get; set; }
        public string? Types { get; set; }
        public string? Subtypes { get; set; }
        public string? Rules { get; set; }
        public string? Legalities { get; set; }
        public string? Attacks { get; set; }
        public string? Weaknesses { get; set; }
        public string? Resistances { get; set; }
        public string? Abilities { get; set; }
        public string? TcgUrl { get; set; }
        public string? CardMarket { get; set; }
        public double? TcgPlayerPriceNormal { get; set; }
        public double? TcgPlayerPriceHolofoil { get; set; }
        public double? CardMarketPrice { get; set; }
    }
} 