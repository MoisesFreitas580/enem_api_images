import { Injectable } from '@nestjs/common';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IStorageProvider } from './storage.interface';

@Injectable()
export class S3StorageProvider implements IStorageProvider {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET_NAME as string;
    this.s3Client = new S3Client({
      //      endpoint: process.env.AWS_ENDPOINT_URL,
      // region: process.env.AWS_DEFAULT_REGION || 'sjc',
      // credentials: {
      //   accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      // },
      // forcePathStyle: true, 
    });
  }

  async gerarUrlVisualizacao(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }
}
