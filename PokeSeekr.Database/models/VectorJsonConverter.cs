using System.Text.Json;
using System.Text.Json.Serialization;
using Pgvector;

namespace PokeSeekr.API.Models
{
    public class VectorJsonConverter : JsonConverter<Vector>
    {
        public override Vector Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType != JsonTokenType.StartArray)
            {
                throw new JsonException("Expected start of array");
            }

            var elements = new List<float>();
            
            reader.Read(); // Move past StartArray

            while (reader.TokenType != JsonTokenType.EndArray)
            {
                if (reader.TokenType == JsonTokenType.Number)
                {
                    elements.Add(reader.GetSingle());
                }
                else
                {
                    throw new JsonException("Expected number in array");
                }
                reader.Read();
            }

            return new Vector(elements.ToArray());
        }

        public override void Write(Utf8JsonWriter writer, Vector value, JsonSerializerOptions options)
        {
            writer.WriteStartArray();
            foreach (var element in value.ToArray())
            {
                writer.WriteNumberValue(element);
            }
            writer.WriteEndArray();
        }
    }
} 