export interface Repository<Entity, EntityId> {
  save(data: Entity): Entity;
  getAll(): Array<Entity>;
  findById(id: EntityId): Entity | null;
  delete(id: EntityId): void;
}
