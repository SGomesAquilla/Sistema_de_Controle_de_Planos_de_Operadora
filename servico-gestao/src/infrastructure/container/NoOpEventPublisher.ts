import { Injectable } from '@nestjs/common';
import { IDomainEvent, IEventPublisher } from '../../application/ports/IEventPublisher';

@Injectable()
export class NoOpEventPublisher implements IEventPublisher {
  async publish(event: IDomainEvent): Promise<void> {
    // Fase 1 — sem broker. Fase 2 substituirá por outro script
  }
}