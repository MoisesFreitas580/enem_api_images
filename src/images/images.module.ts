import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService], // permite usar ImagesService em outros módulos (ex: ProdutosModule)
})
export class ImagesModule {}
