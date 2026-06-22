import { Injectable, NotFoundException } from '@nestjs/common';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class ImagesService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET_NAME as string;

    // Configuração de leitura mantida
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

  // Única função necessária: Buscar a URL da imagem pelo caminho exato
  async gerarUrlVisualizacaoSegura(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key, // Aqui vai entrar: enem_2015/enem_d1/regular/question-14.png
    });

    try {
      // Retorna a URL temporária válida por 1 hora
      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } catch {
      throw new NotFoundException(`A imagem '${key}' não foi encontrada no bucket.`);
    }
  }
}