import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import express from 'express';
import { ImagesService } from './images.service';

@Controller()
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('url/*caminho') 
  async buscarImagemDireta(
    @Param('caminho') caminho: string | string[], // <-- Pode vir como string ou array
    @Res() res: express.Response
  ) {
    try {
      // O SEGREDO ESTÁ AQUI:
      // Se for um array, juntamos com '/'. 
      // Se for uma string que o Nest já transformou com vírgulas, trocamos por '/'
      let chaveCorrigida = Array.isArray(caminho) 
        ? caminho.join('/') 
        : caminho.split(',').join('/');

      // Decodifica a chave e gera a URL
      const chaveDecodificada = decodeURIComponent(chaveCorrigida);
      const url = await this.imagesService.gerarUrlVisualizacaoSegura(chaveDecodificada);

      // Redireciona
      return res.redirect(HttpStatus.FOUND, url);
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: error instanceof Error ? error.message : 'Imagem não encontrada.',
      });
    }
  }
}