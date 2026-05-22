export interface IDomainEvent {
  eventName: string;
  occurredAt: Date;
  payload: Record<string, unknown>;
}

export interface IEventPublisher {
  publish(event: IDomainEvent): Promise<void>;
}