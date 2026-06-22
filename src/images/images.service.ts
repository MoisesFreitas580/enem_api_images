import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

@Injectable()
export class ImagesService {
  private s3Client: S3Client;
  private bucketName: string;

  private readonly allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
  private readonly maxSize = 5 * 1024 * 1024; // 5MB

  constructor() {
    // Nomes exatos das variáveis injetadas pelo Railway Bucket
    this.bucketName = process.env.AWS_S3_BUCKET_NAME as string;

    this.s3Client = new S3Client({
      endpoint: process.env.AWS_ENDPOINT_URL,
      region: process.env.AWS_DEFAULT_REGION || 'sjc',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
      forcePathStyle: true, // obrigatório para provedores S3-compatible não-AWS
    });
  }

  // 1. Faz upload de uma imagem para o bucket
  async uploadImagem(file: Express.Multer.File): Promise<{ key: string; url: string }> {
    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Tipo de arquivo não permitido. Use PNG, JPG, GIF ou WEBP.');
    }

    if (file.size > this.maxSize) {
      throw new BadRequestException('Arquivo muito grande. Máximo: 5MB.');
    }

    const ext = file.originalname.split('.').pop();
    const key = `galeria/${randomUUID()}.${ext}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      key,
      url: `/api/images/${encodeURIComponent(key)}/view`,
    };
  }

  // 2. Lista metadados das imagens para a galeria
  async listarImagensParaGaleria() {
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: 'galeria/',
    });

    const response = await this.s3Client.send(command);

    return (
      response.Contents?.map((item) => ({
        key: item.Key,
        tamanho: item.Size,
        ultimaModificacao: item.LastModified,
        urlVisualizacao: `/api/images/${encodeURIComponent(item.Key as string)}/view`,
      })) || []
    );
  }

  // 3. Gera uma URL pré-assinada temporária para o Angular exibir a imagem
  async gerarUrlVisualizacaoSegura(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      // URL expira em 1 hora (3600 segundos) — máximo suportado pelo Railway é 90 dias
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      return url;
    } catch {
      throw new NotFoundException(`Imagem '${key}' não encontrada ou erro no acesso.`);
    }
  }

  // 4. Deleta uma imagem do bucket
  async deletarImagem(key: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }),
      );
    } catch {
      throw new NotFoundException(`Imagem '${key}' não encontrada.`);
    }
  }
}
