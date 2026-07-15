export interface IStorageProvider {
  gerarUrlVisualizacao(key: string, expiresIn?: number): Promise<string>;
}
