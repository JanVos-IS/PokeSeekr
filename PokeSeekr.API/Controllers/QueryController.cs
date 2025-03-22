using Microsoft.AspNetCore.Mvc;
using PokeSeekr.API.Services;
using PokeSeekr.Database.models;

namespace PokeSeekr.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class QueryController : ControllerBase
    {
        private readonly ISeekrService _seekrService;

        public QueryController(ISeekrService seekrService)
        {
            _seekrService = seekrService;
        }

        [HttpPost("search")]
        public async Task<ActionResult<List<PokemonCardDto>>> Search([FromBody] SearchQuery query)
        {
            try
            {
                var results = await _seekrService.SearchAsync(query);
                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("artists")]
        public async Task<ActionResult<List<string>>> GetArtists()
        {
            try
            {
                var artists = await _seekrService.GetArtistsAsync();
                return Ok(artists);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("rarities")]
        public async Task<ActionResult<List<string>>> GetRarities()
        {
            try
            {
                var rarities = await _seekrService.GetRaritiesAsync();
                return Ok(rarities);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("sets")]
        public async Task<ActionResult<List<Set>>> GetSets()
        {
            try
            {
                var sets = await _seekrService.GetSetsAsync();
                return Ok(sets);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("cards/tcgids")]
        public async Task<ActionResult<List<PokemonCardDto>>> GetCardsByTcgIds([FromBody] List<string> tcgIds)
        {
            try
            {
                List<PokemonCardDto> cards = await _seekrService.GetCardsByTcgIdsAsync(tcgIds);
                return Ok(cards);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
