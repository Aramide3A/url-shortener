import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { jwtAuthGuard } from 'src/auth/guard/jwt.gaurd';
import { Response } from 'express';

@Controller('url')
export class UrlController {
  constructor(private urlService: UrlService) {}

  @UseGuards(jwtAuthGuard)
  @Post('generate')
  createUrl(@Body() data, @Request() req) {
    return this.urlService.createUrl(data, req.user);
  }

  @UseGuards(jwtAuthGuard)
  @Get('getAll')
  getAllUrl(@Request() req) {
    return this.urlService.getAllUrl(req.user);
  }

  @UseGuards(jwtAuthGuard)
  @Get(':url')
  async getUrl(@Param('url') url,  @Res() res: Response) {
    try {
      const mainUrl = await this.urlService.getUrl(url);
      if (!mainUrl) throw new NotFoundException('URL not found');
      res.redirect(mainUrl);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
