using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokeSeekr.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddSetRelationshipToPokemonCards : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "set_id",
                table: "pokemon_cards",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_pokemon_cards_set_id",
                table: "pokemon_cards",
                column: "set_id");

            migrationBuilder.AddForeignKey(
                name: "fk_pokemon_cards_sets",
                table: "pokemon_cards",
                column: "set_id",
                principalTable: "sets",
                principalColumn: "set_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_pokemon_cards_sets",
                table: "pokemon_cards");

            migrationBuilder.DropIndex(
                name: "IX_pokemon_cards_set_id",
                table: "pokemon_cards");

            migrationBuilder.DropColumn(
                name: "set_id",
                table: "pokemon_cards");
        }
    }
}
