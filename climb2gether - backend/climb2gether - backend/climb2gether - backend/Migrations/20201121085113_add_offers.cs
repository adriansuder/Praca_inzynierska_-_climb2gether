using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace climb2gether___backend.Migrations
{
    public partial class add_offers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Offers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<DateTime>(nullable: false),
                    Location = table.Column<string>(nullable: true),
                    MaxParticipants = table.Column<int>(nullable: false),
                    Price = table.Column<double>(nullable: false),
                    Describe = table.Column<string>(nullable: true),
                    OfferType = table.Column<string>(nullable: true),
                    CreationDate = table.Column<DateTime>(nullable: false),
                    OfferOwnerUserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Offers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Offers_AspNetUsers_OfferOwnerUserId",
                        column: x => x.OfferOwnerUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OfferEnrollments",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ParticipantUserId = table.Column<int>(nullable: false),
                    OfferId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OfferEnrollments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OfferEnrollments_Offers_OfferId",
                        column: x => x.OfferId,
                        principalTable: "Offers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_OfferEnrollments_AspNetUsers_ParticipantUserId",
                        column: x => x.ParticipantUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OfferEnrollments_OfferId",
                table: "OfferEnrollments",
                column: "OfferId");

            migrationBuilder.CreateIndex(
                name: "IX_OfferEnrollments_ParticipantUserId",
                table: "OfferEnrollments",
                column: "ParticipantUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Offers_OfferOwnerUserId",
                table: "Offers",
                column: "OfferOwnerUserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OfferEnrollments");

            migrationBuilder.DropTable(
                name: "Offers");
        }
    }
}
