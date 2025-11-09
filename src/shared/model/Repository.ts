export interface Repository<Entity, EntityId> {
  save(data: Entity): Promise<Entity>;
  getAll(): Promise<Array<Entity>>;
  findById(id: EntityId): Promise<Entity>;
  update(data: Entity): Promise<Entity>;
  delete(id: EntityId): Promise<void>;
}
