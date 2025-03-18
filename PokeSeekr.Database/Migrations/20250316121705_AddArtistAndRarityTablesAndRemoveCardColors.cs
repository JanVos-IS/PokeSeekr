using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Pgvector;

#nullable disable

namespace PokeSeekr.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddArtistAndRarityTablesAndRemoveCardColors : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropTable(
            //    name: "pokemon_card_colors");

            migrationBuilder.CreateTable(
                name: "artists",
                columns: table => new
                {
                    artist_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("artists_pkey", x => x.artist_id);
                });

            migrationBuilder.CreateTable(
                name: "rarities",
                columns: table => new
                {
                    rarity_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("rarities_pkey", x => x.rarity_id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_artists_name",
                table: "artists",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_rarities_name",
                table: "rarities",
                column: "name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "artists");

            migrationBuilder.DropTable(
                name: "rarities");

            migrationBuilder.CreateTable(
                name: "pokemon_card_colors",
                columns: table => new
                {
                    pokemon_card_id = table.Column<int>(type: "integer", nullable: false),
                    color_index = table.Column<int>(type: "integer", nullable: false),
                    Color = table.Column<Vector>(type: "vector(3)", nullable: false),
                    coverage = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pokemon_card_colors_pkey", x => new { x.pokemon_card_id, x.color_index });
                    table.ForeignKey(
                        name: "pokemon_card_colors_pokemon_card_id_fkey",
                        column: x => x.pokemon_card_id,
                        principalTable: "pokemon_cards",
                        principalColumn: "pokemon_card_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "pokemon_card_colors_pokemon_card_id_idx",
                table: "pokemon_card_colors",
                column: "pokemon_card_id");

            migrationBuilder.CreateIndex(
                name: "uq_pokemon_card_color",
                table: "pokemon_card_colors",
                columns: new[] { "pokemon_card_id", "color_index" },
                unique: true);
        }
    }
}
