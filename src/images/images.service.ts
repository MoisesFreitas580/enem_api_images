import { Injectable, NotFoundException } from '@nestjs/common';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class ImagesService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET_NAME as string;
    this.s3Client = new S3Client({});
  }

  async gerarUrlVisualizacaoSegura(key: string): Promise<string> {
    console.log(`Gerando URL segura para a imagem com chave: ${this.bucketName}/${key}`);
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } catch {
      throw new NotFoundException(`A imagem '${key}' não foi encontrada no bucket.`);
    }
  }
}
