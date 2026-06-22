import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ImagesService } from './images.service';

@Controller('api/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  // POST /api/images/upload
  // Recebe a imagem e envia para o bucket
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado');

    return {
      sucesso: true,
      ...(await this.imagesService.uploadImagem(file)),
    };
  }

  // GET /api/images
  // Retorna a lista de imagens disponíveis na galeria (JSON)
  @Get()
  async getGaleria() {
    const imagens = await this.imagesService.listarImagensParaGaleria();
    return {
      sucesso: true,
      quantidade: imagens.length,
      imagens,
    };
  }

  // GET /api/images/:key/view
  // Retorna uma URL pré-assinada temporária para uso no <img src> (JSON)
  @Get(':key/view')
  async getViewUrl(@Param('key') key: string) {
    const url = await this.imagesService.gerarUrlVisualizacaoSegura(
      decodeURIComponent(key),
    );
    return {
      sucesso: true,
      key,
      urlVisualizacao: url,
    };
  }

  // DELETE /api/images/:key
  // Deleta a imagem do bucket
  @Delete(':key')
  @HttpCode(204)
  async deletar(@Param('key') key: string) {
    await this.imagesService.deletarImagem(decodeURIComponent(key));
  }
}
