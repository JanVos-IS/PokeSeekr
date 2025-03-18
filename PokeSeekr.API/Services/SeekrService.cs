using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PokeSeekr.Database.models;
using PokeSeekr.Database.repositories;
using PokeSeekr.Database.Repositories;

namespace PokeSeekr.API.Services
{
    public interface ISeekrService
    {
        Task<List<PokemonCardDto>> SearchAsync(SearchQuery query);
        Task<List<string>> GetArtistsAsync();
        Task<List<string>> GetRaritiesAsync();
        Task<List<Set>> GetSetsAsync();
    }   

    public class SeekrService : ISeekrService
    {
        private readonly ICardRepo _cardRepo;
        private readonly IArtistRepo _artistRepo;
        private readonly IRarityRepo _rarityRepo;
        private readonly ISetRepo _setRepo;

        public SeekrService(ICardRepo cardRepo, IArtistRepo artistRepo, IRarityRepo rarityRepo, ISetRepo setRepo)
        {
            _cardRepo = cardRepo;
            _artistRepo = artistRepo;
            _rarityRepo = rarityRepo;
            _setRepo = setRepo;
        }

        public async Task<List<PokemonCardDto>> SearchAsync(SearchQuery query)
        {
            return await _cardRepo.SearchAsync(query);
        }

        public async Task<List<string>> GetArtistsAsync()
        {
            return await _artistRepo.GetAllArtistsAsync();
        }

        public async Task<List<string>> GetRaritiesAsync()
        {
            return await _rarityRepo.GetAllRaritiesAsync();
        }

        public async Task<List<Set>> GetSetsAsync()
        {
            return await Task.FromResult(_setRepo.GetSets().ToList());
        }
    }
}