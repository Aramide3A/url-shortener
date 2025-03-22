import { Cache } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { of } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UrlService {
  constructor(
    private prisma: PrismaService,
    private cache_manager: Cache,
  ) {}

  async createUrl(data, user) {
    try {
      let { url, shortUrl } = data;
      const checkUrl = async (shortUrl) => {
        const check = await this.prisma.url.findUnique({ where: { shortUrl } });
        if (check) throw new ConflictException('short url alrready exists');
      };

      if (shortUrl) {
        await checkUrl(shortUrl);
      } else {
        shortUrl = uuidv4().slice(0, 6);
        checkUrl(shortUrl);
      }

      const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      return await this.prisma.url.create({
        data: { url, shortUrl, expiryDate, userId: user.id },
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async getAllUrl(user) {
    try {
      const findUrl = await this.prisma.url.findMany({
        where: { userId: user.id },
      });

      return findUrl;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUrl(url): Promise<string> {
    try {
      const cacheUrl = await this.cache_manager.get<string>(url);
      if (cacheUrl) {
        return cacheUrl;
      }

      const findUrl = await this.prisma.url.findUnique({
        where: { shortUrl: url },
      });

      if (!findUrl) throw new NotFoundException('Url not found');

      if (
        Date.now() > new Date(findUrl.expiryDate).getTime() ||
        findUrl.expired === true
      )
        throw new NotFoundException('Url Expired, Please Reactivate');

      const clicks = (findUrl.clicks += 1);
      const updateClicks = await this.prisma.url.update({
        where: { id: findUrl.id },
        data: { clicks },
      });

      await this.cache_manager.set(url, findUrl.url);

      return findUrl.url;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async UpdateUrl(url, updatedUrl, user) {
    try {
      const findUrl = await this.prisma.url.findUnique({
        where: { shortUrl: url },
      });

      if (!findUrl) throw new NotFoundException('Url not found');

      if (findUrl.userId != user.id)
        throw new UnauthorizedException('You are not allowed modify this url');

      const updateUrl = await this.prisma.url.update({
        where: { id: findUrl.id },
        data: { url: updatedUrl.url },
      });

      return updateUrl;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async reactivateUrl(url, user) {
    try {
      const findUrl = await this.prisma.url.findUnique({
        where: { shortUrl: url },
      });

      if (!findUrl) throw new NotFoundException('Url not found');

      if (findUrl.userId != user.id)
        throw new UnauthorizedException('You are not allowed modify this url');

      const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const updateUrl = await this.prisma.url.update({
        where: { id: findUrl.id },
        data: { expiryDate, expired: false },
      });

      return {
        message: 'You have successfuly reactivated your URL',
        data: updateUrl,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteUrl(url, user) {
    try {
      const findUrl = await this.prisma.url.findUnique({
        where: { shortUrl: url },
      });

      if (!findUrl) throw new NotFoundException('URL not found');

      if (findUrl.userId != user.id)
        throw new UnauthorizedException('You are not allowed modify this url');

      await this.prisma.url.delete({ where: { id: findUrl.id } });

      return {
        message: 'You have successfuly deleted your URL',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Interval(43200000)
  async checkExpiry() {
    const allUrls = await this.prisma.url.findMany({
      where: { expired: false },
    });

    for (const url of allUrls) {
      if (url.expiryDate <= new Date(Date.now()))
        await this.prisma.url.update({
          where: { id: url.id },
          data: { expired: true },
        });
    }

    console.log('✅ Expired URLs checked and updated');
  }
}
