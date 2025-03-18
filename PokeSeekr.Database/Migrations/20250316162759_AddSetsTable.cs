using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PokeSeekr.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddSetsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "sets",
                columns: table => new
                {
                    set_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    tcg_id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    series = table.Column<string>(type: "text", nullable: true),
                    printed_total = table.Column<int>(type: "integer", nullable: true),
                    total = table.Column<int>(type: "integer", nullable: true),
                    release_date = table.Column<string>(type: "text", nullable: true),
                    logo_url = table.Column<string>(type: "text", nullable: true),
                    symbol_url = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("sets_pkey", x => x.set_id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_sets_tcg_id",
                table: "sets",
                column: "tcg_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "sets");
        }
    }
}
