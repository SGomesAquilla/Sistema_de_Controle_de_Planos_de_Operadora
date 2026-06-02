import { Module } from '@nestjs/common';
import { ClienteModule } from './adapters/modules/ClienteModule';
import { PlanoModule } from './adapters/modules/PlanoModule';
import { AssinaturaModule } from './adapters/modules/AssinaturaModule';

@Module({
  imports: [
    ClienteModule,
    PlanoModule,
    AssinaturaModule,
  ],
})
export class AppModule {}