using Microsoft.EntityFrameworkCore;
using PokeSeekr.Database.models;
using PokeSeekr.Database.Repositories;
using System.Collections.Generic;
using System.Linq;

namespace PokeSeekr.Database.repositories
{
    public class SetRepo : ISetRepo
    {
        private readonly PostgresContext _context;

        public SetRepo(PostgresContext context)
        {
            _context = context;
        }

        public IEnumerable<Set> GetSets()
        {
            return _context.Sets.ToList();
        }

        public int UpsertSets(IEnumerable<Set> sets)
        {
            int count = 0;

            foreach (var set in sets)
            {
                var existingSet = _context.Sets.FirstOrDefault(s => s.TcgId == set.TcgId);

                if (existingSet == null)
                {
                    _context.Sets.Add(set);
                    count++;
                }
                else
                {
                    // Update existing set properties
                    existingSet.Name = set.Name;
                    existingSet.Series = set.Series;
                    existingSet.PrintedTotal = set.PrintedTotal;
                    existingSet.Total = set.Total;
                    existingSet.ReleaseDate = set.ReleaseDate;
                    existingSet.LogoUrl = set.LogoUrl;
                    existingSet.SymbolUrl = set.SymbolUrl;
                }
            }

            _context.SaveChanges();
            return count;
        }
    }
} 