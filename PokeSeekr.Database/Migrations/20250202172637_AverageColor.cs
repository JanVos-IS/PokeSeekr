using Microsoft.EntityFrameworkCore.Migrations;
using Pgvector;

#nullable disable

namespace PokeSeekr.Database.Migrations
{
    /// <inheritdoc />
    public partial class AverageColor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Vector>(
                name: "AverageColor",
                table: "pokemon_cards",
                type: "vector(3)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AverageColor",
                table: "pokemon_cards");
        }
    }
}
