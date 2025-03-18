using Pgvector;
using PokeSeekr.API.Models;
using System.Text.Json.Serialization;

namespace PokeSeekr.Database.models
{
    public class SearchQuery
    {
        public SearchQuery()
        {
        }

        public string? Name { get; set; }
        public string? Rarity { get; set; }
        public string? Artist { get; set; }
        public string? Set { get; set; }
        public string? TcgId { get; set; }
        
        [JsonConverter(typeof(VectorJsonConverter))]
        public Vector? Color { get; set; }
    }
}