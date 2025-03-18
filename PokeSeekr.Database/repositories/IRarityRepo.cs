using System.Collections.Generic;
using System.Threading.Tasks;

namespace PokeSeekr.Database.Repositories
{
    public interface IRarityRepo
    {
        int UpsertRarities(IEnumerable<string> rarities);
        Task<List<string>> GetAllRaritiesAsync();
    }
} 