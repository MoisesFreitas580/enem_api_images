import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import express from 'express';
import { ImagesService } from './images.service';

@Controller()
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('url/*caminho')
  async buscarImagemDireta(
    @Param('caminho') caminho: string | string[],
    @Res() res: express.Response,
  ) {
    try {
      let chaveCorrigida = Array.isArray(caminho)
        ? caminho.join('/')
        : caminho.split(',').join('/');

      const chaveDecodificada = decodeURIComponent(chaveCorrigida);
      const url = await this.imagesService.gerarUrlVisualizacaoSegura(chaveDecodificada);

      return res.redirect(HttpStatus.FOUND, url);
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: error instanceof Error ? error.message : 'Imagem não encontrada.',
      });
    }
  }
}
