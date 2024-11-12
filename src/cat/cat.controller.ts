import { Controller, Get, Post, Req } from '@nestjs/common';

@Controller('cats')
export class CatController {
    @Get() 
    findAll(@Req() request: Request){
        return 'This action returns all cats';
    }
    @Post()
    create(): string {
      return 'This action adds a new cat';
    }

}
