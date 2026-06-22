import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProdutosModule } from './produtos/produtos.module';
import { ImagesModule } from './images/images.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ProdutosModule, ImagesModule, ConfigModule.forRoot({ isGlobal: true }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
