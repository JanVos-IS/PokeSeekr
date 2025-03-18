using Microsoft.AspNetCore.Mvc;
using PokeSeekr.API.Services;

namespace PokeSeekr.API.Controllers
{
    public class CalculateController : Controller
    {
        private readonly ILogger<CalculateController> _logger;
        private ICalculateService _calculateService;

        public CalculateController(ILogger<CalculateController> logger, ICalculateService databaseBuilder)
        {
            _calculateService = databaseBuilder;
            _logger = logger;
        }

        [HttpGet("CalculateColors")]
        public async Task<string> CalculateColors()
        {
            return _calculateService.CalculateAverageColor();
        }

        [HttpGet("ExtractArtists")]
        public async Task<IActionResult> ExtractArtists()
        {
            try
            {
                var result = _calculateService.ExtractAndUpsertArtistsAsync();
                return Ok(new { Message = $"Successfully processed {result} artists" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error extracting artists");
                return StatusCode(500, new { Error = "An error occurred while extracting artists" });
            }
        }

        [HttpGet("ExtractRarities")]
        public async Task<IActionResult> ExtractRarities()
        {
            try
            {
                var result = _calculateService.ExtractAndUpsertRaritiesAsync();
                return Ok(new { Message = $"Successfully processed {result} rarities" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error extracting rarities");
                return StatusCode(500, new { Error = "An error occurred while extracting rarities" });
            }
        }

        [HttpGet("UpsertSets")]
        public async Task<IActionResult> UpsertSets()
        {
            var result = _calculateService.UpsertSets();
            return Ok(new { Message = $"Successfully processed {result} sets" });
        }

        [HttpGet("LinkSetsToCards")]
        public async Task<IActionResult> LinkSetsToCards()
        {
            var result = _calculateService.LinkSetsToCards();
            return Ok(new { Message = $"Successfully processed {result} sets" });
        }

        [HttpGet("appendWithMissingcolumns")]
        public async Task<IActionResult> appendWithMissingcolumns()
        {
            var result = _calculateService.appendWithMissingcolumns();
            return Ok(new { Message = $"Successfully processed {result} sets" });
        }

        [HttpGet("appendMissingColumns/{batchSize?}")]
        public async Task<IActionResult> AppendMissingColumns(int? batchSize = null)
        {
            try
            {
                var result = _calculateService.appendWithMissingcolumns(batchSize);
                return Ok(new { Message = $"Successfully processed {result} cards with missing columns" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error appending missing columns");
                return StatusCode(500, new { Error = "An error occurred while appending missing columns", Details = ex.Message });
            }
        }
    }
}
