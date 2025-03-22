import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { jwtAuthGuard } from 'src/auth/guard/jwt.gaurd';
import { Response } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';

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

  @UseGuards(jwtAuthGuard, ThrottlerGuard)
  @Get(':url')
  async getUrl(@Param('url') url: string, @Res() res: Response) {
    try {
      const mainUrl = await this.urlService.getUrl(url);
      if (!mainUrl) throw new NotFoundException('URL not found');
      res.redirect(mainUrl);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(jwtAuthGuard)
  @Put(':url/update')
  updateURl(@Param('url') url, @Body() data, @Request() req) {
    return this.urlService.UpdateUrl(url, data, req.user);
  }

  @UseGuards(jwtAuthGuard)
  @Put(':url/reactivate')
  reactivateUrl(@Param('url') url, @Body() data, @Request() req) {
    return this.urlService.reactivateUrl(url, req.user);
  }

  @UseGuards(jwtAuthGuard)
  @Delete(':url/delete')
  deleteUrl(@Param('url') url, @Request() req) {
    return this.urlService.deleteUrl(url, req.user);
  }
}
