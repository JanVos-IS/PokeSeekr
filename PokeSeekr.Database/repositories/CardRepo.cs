using Microsoft.EntityFrameworkCore;
using Npgsql;
using PokeSeekr.Database.models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PokeSeekr.Database.repositories
{
    public interface ICardRepo
    {
        IEnumerable<PokemonCard> GetCards();
        Task<List<PokemonCardDto>> SearchAsync(SearchQuery query);
        void Save();
    }

    public class CardRepo : ICardRepo
    {
        private PostgresContext _postgresContext;
        public CardRepo(PostgresContext postgresContext)
        {
            _postgresContext = postgresContext;
        }

        public IEnumerable<PokemonCard> GetCards()
        {
            return _postgresContext.PokemonCards;
        }

        public async Task<List<PokemonCardDto>> SearchAsync(SearchQuery query)
        {
            // 1) Use EF to do your standard filtering
            IQueryable<PokemonCard> cards = _postgresContext.PokemonCards.Include(c => c.Set);

            // Filter by TCG ID if provided
            if (!string.IsNullOrWhiteSpace(query.TcgId))
                cards = cards.Where(c => c.TcgId == query.TcgId);

            // Filter by name if provided
            if (!string.IsNullOrWhiteSpace(query.Name))
                cards = cards.Where(c => c.Name.ToLower().Contains(query.Name.ToLower()));

            // Filter by rarity if provided
            if (!string.IsNullOrWhiteSpace(query.Rarity))
                cards = cards.Where(c => c.Rarity != null && c.Rarity.ToLower() == query.Rarity.ToLower());

            // Filter by artist if provided
            if (!string.IsNullOrWhiteSpace(query.Artist))
                cards = cards.Where(c => c.Artist != null && c.Artist.ToLower() == query.Artist.ToLower());

            // Filter by set if provided
            if (!string.IsNullOrWhiteSpace(query.Set))
                cards = cards.Where(c => c.Set != null && c.Set.Name.ToLower() == query.Set.ToLower());

            // Materialize the cards in memory so we have them (and their IDs).
            List<PokemonCard> filteredCards = await cards.ToListAsync();

            // If nothing matched, just return immediately
            if (!filteredCards.Any())
                return new List<PokemonCardDto>();

            // Map entities to DTOs
            var cardDtos = filteredCards.Select(card => new PokemonCardDto
            {
                PokemonCardId = card.PokemonCardId,
                TcgId = card.TcgId,
                Name = card.Name,
                Supertype = card.Supertype,
                Level = card.Level,
                Hp = card.Hp,
                EvolvesFrom = card.EvolvesFrom,
                Number = card.Number,
                Artist = card.Artist,
                Rarity = card.Rarity,
                FlavorText = card.FlavorText,
                ImageSmall = card.ImageSmall,
                ImageLarge = card.ImageLarge,
                Downloaded = card.Downloaded,
                AverageColor = card.AverageColor,
                SetName = card.Set?.Name,
                // Additional properties from PokemonTcgSdk
                EvolvesTo = card.EvolvesTo,
                RegulationMark = card.RegulationMark,
                Types = card.Types,
                Subtypes = card.Subtypes,
                Rules = card.Rules,
                Legalities = card.Legalities,
                Attacks = card.Attacks, 
                Weaknesses = card.Weaknesses,
                Resistances = card.Resistances,
                Abilities = card.Abilities,
                TcgUrl = card.TcgUrl,
                CardMarket = card.CardMarket,
                TcgPlayerPriceNormal = card.TcgPlayerPriceNormal,
                TcgPlayerPriceHolofoil = card.TcgPlayerPriceHolofoil,
                CardMarketPrice = card.CardMarketPrice
            }).ToList();

            if(query.Color == null)
                return cardDtos;

            // 2) Extract the IDs to pass to the raw SQL
            var filteredIds = filteredCards.Select(c => c.PokemonCardId).ToList();

            // 3) Run raw SQL with pgvector to order by color similarity
            //    We only include the already-filtered IDs, so our CROSS JOIN
            //    is constrained to p.pokemon_card_id in (the set of filtered IDs).

            // Construct a string representation of the color vector for PG, e.g. [0, 0, 0.6]
            var colorVectorString = query.Color.ToString();

            // Example coverage: 1.0 for demonstration
            const float coverage = 1.0f;

            // The raw SQL:
            // We define a CTE with input_colors (the color vector(s) we want to compare against).
            // Then we cross join against your 'pokemon_cards' table, but only keep the rows whose 
            // IDs are in @CardIds. We sum up distances (<->), multiply by coverage if needed, 
            // and order by that total_score.

            var sql = @"
        WITH input_colors AS (
            SELECT *
            FROM (VALUES (1, @ColorVector::public.vector, @Coverage)) 
                 AS t(input_index, color, coverage)
        )
        SELECT p.pokemon_card_id
        FROM input_colors ic
        CROSS JOIN public.pokemon_cards p
        WHERE p.pokemon_card_id = ANY(@CardIds)
        GROUP BY p.pokemon_card_id
        ORDER BY SUM((ic.color <-> p.""AverageColor"") * ic.coverage) ASC
    ";

            // 4) Execute the SQL, pulling back sorted IDs
            // Note: Depending on your EF version and provider, you might need to use FromSqlRaw/SqlQuery/etc.
            // Also note you need parameters for color vector, coverage, and the ID list.
            var sortedIds = await _postgresContext
                .PokemonCards
                .FromSqlRaw(sql,
                    new NpgsqlParameter("ColorVector", colorVectorString),
                    new NpgsqlParameter("Coverage", coverage),
                    new NpgsqlParameter("CardIds", filteredIds.ToArray()))
                .Select(x => x.PokemonCardId) // Because the SELECT returns only p.pokemon_card_id
                .ToListAsync();

            // 5) Now we reorder our in-memory DTO objects in the order returned by the raw query.
            // First, map from ID -> DTO object
            var cardDtoDict = cardDtos.ToDictionary(card => card.PokemonCardId, card => card);

            var finalSortedCardDtos = new List<PokemonCardDto>(sortedIds.Count);
            foreach (var id in sortedIds)
            {
                if (cardDtoDict.TryGetValue(id, out var cardDto))
                {
                    finalSortedCardDtos.Add(cardDto);
                }
            }

            return finalSortedCardDtos;
        }

        public void Save()
        {
            _postgresContext.SaveChanges();
        }
    }
}
