import { ApiProperty } from "@nestjs/swagger";
import {IsEnum, IsNotEmpty, IsNumber, Length } from "class-validator";

enum Status{
    'do', 'done', 'progress'
}

export class CreateTaskDto {
    @ApiProperty({ description: "Task creator" })
    @IsNotEmpty()
    creatorId: string
    @ApiProperty({ description: "Task owner" })
    @IsNotEmpty()
    userId: string
    @ApiProperty({ description: "Task name" })
    @IsNotEmpty()
    @Length(3, 50)
    task: string;
  
    @ApiProperty({ 
        description: "Task status ( do, progress, done)",
        enum: Status
     })
     @IsEnum(Status, { message: 'Status must be one of: do, progress, done' })
    @IsNotEmpty()
    status: Status;

    @ApiProperty({ description: "Sequence number" })
    @IsNotEmpty()
    @IsNumber()
    num: string;
}

