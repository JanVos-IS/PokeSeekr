using System.Collections.Generic;
using System.Threading.Tasks;

namespace PokeSeekr.Database.Repositories
{
    public interface IArtistRepo
    {
        int UpsertArtists(IEnumerable<string> artists);
        Task<List<string>> GetAllArtistsAsync();
    }
}