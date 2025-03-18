using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokeSeekr.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddMissingCardPropertites : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Abilities",
                table: "pokemon_cards",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Attacks",
                table: "pokemon_cards",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CardMarket",
                table: "pokemon_cards",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "CardMarketPrice",
                table: "pokemon_cards",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EvolvesTo",
                table: "pokemon_cards",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Legalities",
                table: "pokemon_cards",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RegulationMark",
                table: "pokemon_cards",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Resistances",
                table: "pokemon_cards",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Rules",
                table: "pokemon_cards",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Subtypes",
                table: "pokemon_cards",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "TcgPlayerPriceHolofoil",
                table: "pokemon_cards",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "TcgPlayerPriceNormal",
                table: "pokemon_cards",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TcgUrl",
                table: "pokemon_cards",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Types",
                table: "pokemon_cards",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Weaknesses",
                table: "pokemon_cards",
                type: "jsonb",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Abilities",
                table: "pokemon_cards");

            migrationBuilder.DropColumn(
                name: "Attacks",
                table: "pokemon_cards");

            migrationBuilder.DropColumn(
                name: "CardMarket",
                table: "pokemon_cards");

            migrationBuilder.DropColumn(
                name: "CardMarketPrice",
                table: "pokemon_cards");

            migrationBuilder.DropColumn(
                name: "EvolvesTo",
                table: "pokemon_cards");

            migrationBuilder.DropColumn(
                name: "Legalities",
                table: "pokemon_cards");

            migrationBuilder.DropColumn(
                name: "RegulationMark",
                table: "pokemon_cards");

            migrationBuilder.DropColumn(
                name: "Resistances",
                table: "pokemon_cards");

            migrationBuilder.DropColumn(
                name: "Rules",
                table: "pokemon_cards");

            migrationBuilder.DropColumn(
                name: "Subtypes",
                table: "pokemon_cards");

            migrationBuilder.DropColumn(
                name: "TcgPlayerPriceHolofoil",
                table: "pokemon_cards");

            migrationBuilder.DropColumn(
                name: "TcgPlayerPriceNormal",
                table: "pokemon_cards");

            migrationBuilder.DropColumn(
                name: "TcgUrl",
                table: "pokemon_cards");

            migrationBuilder.DropColumn(
                name: "Types",
                table: "pokemon_cards");

            migrationBuilder.DropColumn(
                name: "Weaknesses",
                table: "pokemon_cards");
        }
    }
}
