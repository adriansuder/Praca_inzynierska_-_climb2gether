using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace climb2gether___backend.Migrations
{
    public partial class chat_v3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastEventDate",
                table: "Conversations",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastEventDate",
                table: "Conversations");
        }
    }
}
