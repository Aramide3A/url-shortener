import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { UrlService } from './url.service';
import { jwtAuthGuard } from 'src/auth/guard/jwt.gaurd';

@Controller('url')
export class UrlController {
    constructor(private usrlService:UrlService){}

    @UseGuards(jwtAuthGuard)
    @Post('generate')
    createUrl(@Body() data, @Request() req){
        console.log(req.user)
        return this.usrlService.createUrl(data, req.user)
    }
}
