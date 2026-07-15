import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { S3StorageProvider } from './storage/s3.storage';
import { STORAGE_PROVIDER } from './storage/storage.token';

@Module({
  controllers: [ImagesController],
  providers: [
    ImagesService,
    {
      provide: STORAGE_PROVIDER,
      useClass: S3StorageProvider, // ← troca aqui se mudar de provedor
    },
  ],
  exports: [ImagesService],
})
export class ImagesModule {}
