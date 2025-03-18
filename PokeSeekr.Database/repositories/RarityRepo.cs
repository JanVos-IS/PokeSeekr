using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PokeSeekr.Database.models;

namespace PokeSeekr.Database.Repositories
{
    public class RarityRepo : IRarityRepo
    {
        private readonly PostgresContext _context;

        public RarityRepo(PostgresContext context)
        {
            _context = context;
        }

        public int UpsertRarities(IEnumerable<string> rarities)
        {
            var existingRarities = _context.Rarities
                .Where(r => rarities.Contains(r.Name))
                .ToDictionary(r => r.Name, r => r);
            
            int count = 0;
            foreach (var rarity in rarities)
            {
                if (!existingRarities.ContainsKey(rarity))
                {
                    _context.Rarities.Add(new Rarity { Name = rarity });
                    count++;    
                }
            }

            _context.SaveChanges();
            return count;
        }

        public async Task<List<string>> GetAllRaritiesAsync()
        {
            return await _context.Rarities
                .OrderBy(r => r.Name)
                .Select(r => r.Name)
                .ToListAsync();
        }
    }
} 