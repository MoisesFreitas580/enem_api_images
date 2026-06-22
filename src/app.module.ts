import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProdutosModule } from './produtos/produtos.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [ProdutosModule, ImagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
