// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { AdminController } from 'src/controllers/admin.controller';

@Module({
  controllers: [AdminController],
  providers: [],
  exports: [],
})
export class AdminModule {}
