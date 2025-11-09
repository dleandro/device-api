export interface Repository<Entity, EntityId> {
  save(data: Entity): Entity;
  getAll(): Array<Entity>;
  findById(id: EntityId): Entity | null;
  update(data: Entity): Entity;
  delete(id: EntityId): void;
}
