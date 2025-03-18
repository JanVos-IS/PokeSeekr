using PokeSeekr.Database.models;
using System.Collections.Generic;

namespace PokeSeekr.Database.Repositories
{
    public interface ISetRepo
    {
        IEnumerable<Set> GetSets();
        int UpsertSets(IEnumerable<Set> sets);
    }
} 