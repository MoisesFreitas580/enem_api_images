import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IStorageProvider } from './storage/storage.interface';
import { STORAGE_PROVIDER } from './storage/storage.token';

@Injectable()
export class ImagesService {
  constructor(
    @Inject(STORAGE_PROVIDER)
    private readonly storage: IStorageProvider,
  ) {}

  async gerarUrlVisualizacaoSegura(key: string): Promise<string> {
    try {
      return await this.storage.gerarUrlVisualizacao(key);
    } catch {
      throw new NotFoundException(`A imagem '${key}' não foi encontrada.`);
    }
  }
}
