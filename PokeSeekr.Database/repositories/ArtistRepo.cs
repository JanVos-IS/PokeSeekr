using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PokeSeekr.Database.models;

namespace PokeSeekr.Database.Repositories
{
    public class ArtistRepo : IArtistRepo
    {
        private readonly PostgresContext _context;

        public ArtistRepo(PostgresContext context)
        {
            _context = context;
        }

        public int UpsertArtists(IEnumerable<string> artists)
        {
            var existingArtists = _context.Artists
                .Where(a => artists.Contains(a.Name))
                .ToDictionary(a => a.Name, a => a);
            
            int count = 0;
            foreach (var artist in artists)
            {
                if (!existingArtists.ContainsKey(artist))
                {
                    _context.Artists.Add(new Artist { Name = artist });
                    count++;    
                }
            }

            _context.SaveChanges();
            return count;
        }

        public async Task<List<string>> GetAllArtistsAsync()
        {
            return await _context.Artists
                .OrderBy(a => a.Name)
                .Select(a => a.Name)
                .ToListAsync();
        }
    }
}