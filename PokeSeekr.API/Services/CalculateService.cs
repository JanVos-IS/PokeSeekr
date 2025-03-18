using PokeSeekr.Database.repositories;
using PokeSeekr.Database.Repositories;
using PokeSeekr.Database.models;
using PokemonTcgSdk;
using System.Collections.Generic;
using System.Linq;
using PokemonTcgSdk.Standard.Infrastructure.HttpClients.Set;
using PokemonTcgSdk.Standard.Infrastructure.HttpClients;
using System.Text.Json;
using System.Threading.Tasks;
using PokemonTcgSdk.Standard.Infrastructure.HttpClients.Cards;
using System;
using PokemonTcgSdk.Standard.Infrastructure;
using PokemonTcgSdk.Standard.Features.FilterBuilder.Pokemon;

namespace PokeSeekr.API.Services
{
    public interface ICalculateService
    {
        string CalculateAverageColor();
        int ExtractAndUpsertArtistsAsync();
        int ExtractAndUpsertRaritiesAsync();
        int LinkSetsToCards();
        int UpsertSets();
        int appendWithMissingcolumns();
        int appendWithMissingcolumns(int? batchSize);
    }

    public class CalculateService : ICalculateService
    {
        private readonly ICardRepo _cardRepo;
        private readonly IArtistRepo _artistRepo;
        private readonly IRarityRepo _rarityRepo;
        private readonly ISetRepo _setRepo;
        private readonly PokemonApiClient _pokemonApiClient;

        public CalculateService(
            ICardRepo cardRepo, 
            IArtistRepo artistRepo, 
            IRarityRepo rarityRepo, 
            ISetRepo setRepo,
            PokemonApiClient pokemonApiClient)
        {
            _cardRepo = cardRepo;
            _artistRepo = artistRepo;
            _rarityRepo = rarityRepo;
            _setRepo = setRepo;
            _pokemonApiClient = pokemonApiClient;
        }

        public int ExtractAndUpsertArtistsAsync()
        {
            // Get all cards
            var cards = _cardRepo.GetCards();

            // Extract unique artists (non-null and non-empty)
            IEnumerable<string> uniqueArtists = cards
                .Where(card => !string.IsNullOrWhiteSpace(card.Artist))
                .Select(card => card.Artist)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .Where(artist => artist != null)
                .Cast<string>()
                .Order();

            return _artistRepo.UpsertArtists(uniqueArtists);
        }

        public int ExtractAndUpsertRaritiesAsync()
        {
            // Get all cards
            var cards = _cardRepo.GetCards();

            // Extract unique rarities (non-null and non-empty)
            IEnumerable<string> uniqueRarities = cards
                .Where(card => !string.IsNullOrWhiteSpace(card.Rarity))
                .Select(card => card.Rarity)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .Where(rarity => rarity != null)
                .Cast<string>()
                .Order();

            return _rarityRepo.UpsertRarities(uniqueRarities);
        }

        public int UpsertSets()
        {
            // Get all sets from the Pokemon TCG API
            var apiSets = _pokemonApiClient.GetApiResourceAsync<PokemonTcgSdk.Standard.Infrastructure.HttpClients.Set.Set>().Result.Results;

            // Convert API sets to our Set model
            var sets = apiSets.Select(apiSet => new Database.models.Set
            {
                TcgId = apiSet.Id,
                Name = apiSet.Name,
                Series = apiSet.Series,
                PrintedTotal = (int?)apiSet.PrintedTotal,
                Total = (int?)apiSet.Total,
                ReleaseDate = apiSet.ReleaseDate,
                LogoUrl = apiSet.Images?.Logo.ToString(),
                SymbolUrl = apiSet.Images?.Symbol.ToString()
            });

            // Upsert sets to the database
            return _setRepo.UpsertSets(sets);
        }

        public string CalculateAverageColor()
        {
            //IEnumerable<PokemonCard> cards = _cardRepo.GetCards();
            //var count = cards.Count();
            //int counter = 0;

            //foreach (PokemonCard card in cards)
            //{

            //    var colors = card.PokemonCardColors;

            //    if(colors.Count() == 0)
            //    {
            //        continue;
            //    }

            //    var averageColor = new Vector(new float[] { 0, 0, 0 }).ToArray();

            //    foreach (PokemonCardColor color in colors)
            //    {
            //        var colorComponents = color.Color.ToArray();
            //    }
            //}
            return "";
        }

        public int LinkSetsToCards()
        {
            var cards = _cardRepo.GetCards();
            var sets = _setRepo.GetSets();
            int updatedCount = 0;

            foreach (var card in cards)
            {
                // Extract set ID from the card's TcgId (format is typically "set-number")
                string setId = card.TcgId.Split("-")[0];
                
                // Find the corresponding set
                var matchingSet = sets.FirstOrDefault(s => s.TcgId.Equals(setId, StringComparison.OrdinalIgnoreCase));
                
                if (matchingSet != null)
                {
                    card.Set = matchingSet;
                    card.SetId = matchingSet.SetId;
                    updatedCount++;
                }
            }

            // Save the changes to the database
            _cardRepo.Save();
            
            return updatedCount;
        }

        public int appendWithMissingcolumns()
        {
            // Get all cards from our database
            var cards = _cardRepo.GetCards().ToList();
            int updatedCount = 0;

            // Process cards in batches to avoid excessive API calls
            var batchSize = 100;
            for (int i = 0; i < cards.Count; i += batchSize)
            {
                var batch = cards.Skip(i).Take(batchSize).ToList();
                
                // Process each card in the batch
                foreach (var card in batch)
                {
                    try
                    {
                        // Query the Pokemon TCG API for the card by its TCG ID
                        // Using the same pattern as in UpsertSets method
                        var filter = PokemonFilterBuilder.CreatePokemonFilter().AddId(card.TcgId);
                        var apiResponse = _pokemonApiClient.GetApiResourceAsync<Card>(filter).Result;
                        if (apiResponse != null && apiResponse.Results != null && apiResponse.Results.Any())
                        {
                            // Update the card with the missing properties from the API response
                            UpdateCardFromApiResponse(card, apiResponse.Results.First());
                            updatedCount++;
                        }
                    }
                    catch (Exception ex)
                    {
                        // Log the error and continue with the next card
                        Console.WriteLine($"Error updating card {card.TcgId}: {ex.Message}");
                    }
                }

                // Save changes after each batch
                _cardRepo.Save();
            }

            return updatedCount;
        }

        public int appendWithMissingcolumns(int? customBatchSize)
        {
            // Get all cards from our database
            var cards = _cardRepo.GetCards().ToList();
            int updatedCount = 0;

            // Process cards in batches to avoid excessive API calls
            var batchSize = customBatchSize ?? 100; // Use custom batch size or default to 100
            for (int i = 0; i < cards.Count; i += batchSize)
            {
                var batch = cards.Skip(i).Take(batchSize).ToList();
                
                // Process each card in the batch
                foreach (var card in batch)
                {
                    try
                    {
                        // Query the Pokemon TCG API for the card by its TCG ID
                        // Using the same pattern as in UpsertSets method
                        var filter = PokemonFilterBuilder.CreatePokemonFilter().AddId(card.TcgId);
                        var apiResponse = _pokemonApiClient.GetApiResourceAsync<Card>(filter).Result;
                        if (apiResponse != null && apiResponse.Results != null && apiResponse.Results.Any())
                        {
                            // Update the card with the missing properties from the API response
                            UpdateCardFromApiResponse(card, apiResponse.Results.First());
                            updatedCount++;
                        }
                    }
                    catch (Exception ex)
                    {
                        // Log the error and continue with the next card
                        Console.WriteLine($"Error updating card {card.TcgId}: {ex.Message}");
                    }
                }

                // Save changes after each batch
                _cardRepo.Save();
            }

            return updatedCount;
        }

        private void UpdateCardFromApiResponse(Database.models.PokemonCard card, Card apiCard)
        {
            if (apiCard == null)
                return;

            try
            {
                // Update basic properties
                if (apiCard.EvolvesTo != null)
                {
                    card.EvolvesTo = string.Join(",", apiCard.EvolvesTo);
                }
                
                // Use reflection to safely get properties that might not exist
                card.RegulationMark = GetPropertyValueSafely<string>(apiCard, "RegulationMark");

                // Convert complex objects to JSON strings for storage
                card.Types = apiCard.Types != null ? JsonSerializer.Serialize(apiCard.Types) : null;
                card.Subtypes = apiCard.Subtypes != null ? JsonSerializer.Serialize(apiCard.Subtypes) : null;
                card.Rules = apiCard.Rules != null ? JsonSerializer.Serialize(apiCard.Rules) : null;
                card.Legalities = apiCard.Legalities != null ? JsonSerializer.Serialize(apiCard.Legalities) : null;
                card.Attacks = apiCard.Attacks != null ? JsonSerializer.Serialize(apiCard.Attacks) : null;
                card.Weaknesses = apiCard.Weaknesses != null ? JsonSerializer.Serialize(apiCard.Weaknesses) : null;
                card.Resistances = apiCard.Resistances != null ? JsonSerializer.Serialize(apiCard.Resistances) : null;
                card.Abilities = apiCard.Abilities != null ? JsonSerializer.Serialize(apiCard.Abilities) : null;

                // Try to get URL if it exists using reflection
                card.TcgUrl = GetPropertyValueSafely<string>(apiCard, "Url") ?? GetPropertyValueSafely<string>(apiCard, "TcgUrl");

                // Update pricing information if available
                if (apiCard.Tcgplayer != null)
                {
                    // Store the whole TCGPlayer data as JSON
                    card.CardMarket = JsonSerializer.Serialize(apiCard.Tcgplayer);
                    
                    // Try to extract prices if they exist
                    if (apiCard.Tcgplayer.Prices != null)
                    {
                        // Use dynamic to handle potential differences in property names
                        dynamic prices = apiCard.Tcgplayer.Prices;
                        
                        // Try to get normal price
                        try
                        {
                            if (prices.Normal != null)
                            {
                                var normalPrice = prices.Normal;
                                card.TcgPlayerPriceNormal = (double?)normalPrice.GetType().GetProperty("Market")?.GetValue(normalPrice, null);
                            }
                        }
                        catch (Exception)
                        {
                            // Property might not exist, ignore
                        }
                        
                        // Try to get holofoil price
                        try
                        {
                            if (prices.Holofoil != null)
                            {
                                var holofoilPrice = prices.Holofoil;
                                card.TcgPlayerPriceHolofoil = (double?)holofoilPrice.GetType().GetProperty("Market")?.GetValue(holofoilPrice, null);
                            }
                        }
                        catch (Exception)
                        {
                            // Property might not exist, ignore
                        }
                    }
                }
                
                // Update CardMarket price if available
                if (apiCard.Cardmarket != null)
                {
                    // Store the whole CardMarket data as JSON
                    card.CardMarket = JsonSerializer.Serialize(apiCard.Cardmarket);
                    
                    // Try to extract average price if it exists
                    try
                    {
                        if (apiCard.Cardmarket.Prices != null)
                        {
                            dynamic prices = apiCard.Cardmarket.Prices;
                            card.CardMarketPrice = (double?)prices.GetType().GetProperty("AvgSellPrice")?.GetValue(prices, null)
                                                ?? (double?)prices.GetType().GetProperty("AverageSellingPrice")?.GetValue(prices, null)
                                                ?? (double?)prices.GetType().GetProperty("Average")?.GetValue(prices, null);
                        }
                    }
                    catch (Exception)
                    {
                        // Property might not exist, ignore
                    }
                }
            }
            catch (Exception ex)
            {
                // Log error but continue
                Console.WriteLine($"Error processing card data: {ex.Message}");
            }
        }

        // Helper method to safely get property values using reflection
        private T GetPropertyValueSafely<T>(object obj, string propertyName)
        {
            try
            {
                var property = obj.GetType().GetProperty(propertyName);
                if (property != null)
                {
                    return (T)property.GetValue(obj, null);
                }
            }
            catch (Exception)
            {
                // Ignore errors
            }
            return default(T);
        }
    }
}
