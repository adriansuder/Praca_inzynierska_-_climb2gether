using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace climb2gether___backend.Migrations
{
    public partial class add_expeditions_table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Expeditions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(nullable: false),
                    DestinationCity = table.Column<string>(nullable: true),
                    Destination = table.Column<string>(nullable: true),
                    DestinationRegion = table.Column<string>(nullable: true),
                    DepartureCity = table.Column<string>(nullable: true),
                    MaxParticipants = table.Column<int>(nullable: false),
                    CreationDate = table.Column<DateTime>(nullable: false),
                    ExpeditionDate = table.Column<DateTime>(nullable: false),
                    DescriptionTitle = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Expeditions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Expeditions_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Expeditions_UserId",
                table: "Expeditions",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Expeditions");
        }
    }
}
