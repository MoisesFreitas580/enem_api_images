import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `${process.env.AWS_S3_BUCKET_NAME as string} ${process.env.AWS_ENDPOINT_URL as string} ${process.env.AWS_DEFAULT_REGION as string}`;
  }
}
