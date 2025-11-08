import http from 'http';

export interface Server {
  setup(): http.Server;
  start(port: number): void;
}
