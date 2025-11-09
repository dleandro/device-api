export interface DbClient {
  connect(config: unknown): Promise<void>;
  disconnect(): Promise<void>;
}
