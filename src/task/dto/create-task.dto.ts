import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, Length } from "class-validator";

export class CreateTaskDto {
    @ApiProperty({ description: "Task creator" })
    @IsNotEmpty()
    userId: string
    @ApiProperty({ description: "Task name" })
    @IsNotEmpty()
    @Length(3, 50)
    task: string;
  
    @ApiProperty({ description: "Task status ( do, progress, done)" })
    @IsNotEmpty()
    status: Status;
}

enum Status{
    'do', 'done', 'progress'
}
