import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import express from 'express';
import { ImagesService } from './images.service';

@Controller()
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  // 1. Atualizado: Demos o nome 'caminho' para o asterisco
  @Get('url/*caminho') 
  async buscarImagemDireta(
    @Param('caminho') key: string, // 2. Atualizado: Pegamos o parâmetro pelo nome
    @Res() res: express.Response
  ) {
    try {
      const chaveDecodificada = decodeURIComponent(key);
      const url = await this.imagesService.gerarUrlVisualizacaoSegura(chaveDecodificada);

      return res.redirect(HttpStatus.FOUND, url);
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: error instanceof Error ? error.message : 'Imagem não encontrada.',
      });
    }
  }
}