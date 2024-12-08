import { ApiProperty } from "@nestjs/swagger";
import {IsBoolean, IsNotEmpty, Length } from "class-validator";
export class CreateTeamDto {
    @ApiProperty({ description: "Team creator" })
    @IsNotEmpty()
    adminId: string;
    @ApiProperty({ description: "Team members" })
    @IsNotEmpty()
    members: string[];
    @ApiProperty({ description: "Team purpose description" })
    @IsNotEmpty()
    @Length(3, 100)
    description: string;
    @ApiProperty({ description: "Team Name" })
    @IsNotEmpty()
    @Length(3, 50)
    name: string
    @ApiProperty({ description: "Team Name" })
    @IsNotEmpty()
    @IsBoolean()
    default: boolean = false
}
