import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GatewayController } from './controllers/GatewayController';
import { ProxyService } from './proxy/ProxyService';

@Module({
  imports: [HttpModule],
  controllers: [GatewayController],
  providers: [ProxyService],
})

export class AppModule {}
