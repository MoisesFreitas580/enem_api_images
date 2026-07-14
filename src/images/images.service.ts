import { Injectable, NotFoundException } from '@nestjs/common';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class ImagesService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET_NAME as string;

    this.s3Client = new S3Client({
      endpoint: process.env.AWS_ENDPOINT_URL,
      region: process.env.AWS_DEFAULT_REGION || 'sjc',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
      forcePathStyle: true, 
    });
  }

  async gerarUrlVisualizacaoSegura(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key, 
    });
    console.log(`Gerando URL segura para a chave: ${this.s3Client.config}`);
    try {
      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } catch {
      throw new NotFoundException(`A imagem '${key}' não foi encontrada no bucket.`);
    }
  }
}