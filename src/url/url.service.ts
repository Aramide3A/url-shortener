import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { find } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UrlService {
  constructor(private prisma: PrismaService) {}

  async createUrl(data, user) {
    try {
      let { url, shortUrl } = data;
      console.log(url);
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

  async getUrl(url) {
    try {
      const findUrl = await this.prisma.url.findUnique({
        where : {shortUrl: url}
      })

      if (!findUrl) throw new NotFoundException('Url not found')

        if ( Date.now() > new Date(findUrl.expiryDate).getTime() || findUrl.expired === true ) throw new NotFoundException('Url not found')

      const clicks = findUrl.clicks +=  1
      const updateClicks = await this.prisma.url.update({
        where: {id: findUrl.id},
        data : {clicks}
      })

      return findUrl.url

    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
