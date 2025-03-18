using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using Pgvector;

#nullable disable

namespace PokeSeekr.Database.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:vector", ",,");

            migrationBuilder.CreateTable(
                name: "pokemon_cards",
                columns: table => new
                {
                    pokemon_card_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    tcg_id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    supertype = table.Column<string>(type: "text", nullable: true),
                    level = table.Column<string>(type: "text", nullable: true),
                    hp = table.Column<string>(type: "text", nullable: true),
                    evolves_from = table.Column<string>(type: "text", nullable: true),
                    number = table.Column<string>(type: "text", nullable: false),
                    artist = table.Column<string>(type: "text", nullable: true),
                    rarity = table.Column<string>(type: "text", nullable: true),
                    flavor_text = table.Column<string>(type: "text", nullable: true),
                    image_small = table.Column<string>(type: "text", nullable: true),
                    image_large = table.Column<string>(type: "text", nullable: true),
                    downloaded = table.Column<bool>(type: "boolean", nullable: true, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pokemon_cards_pkey", x => x.pokemon_card_id);
                });

            migrationBuilder.CreateTable(
                name: "pokemon_card_colors",
                columns: table => new
                {
                    pokemon_card_id = table.Column<int>(type: "integer", nullable: false),
                    color_index = table.Column<int>(type: "integer", nullable: false),
                    coverage = table.Column<decimal>(type: "numeric", nullable: false),
                    Color = table.Column<Vector>(type: "vector(3)", nullable: false)
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "pokemon_card_colors");

            migrationBuilder.DropTable(
                name: "pokemon_cards");
        }
    }
}
