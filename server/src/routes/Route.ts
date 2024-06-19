import { RouteOptions } from 'fastify';

export type Route = {
  method: 'GET' | 'POST' | 'PUT';
  url: string;
  schema: {
    description: string;
    tags: string[];
    params?: unknown;
    body?: unknown;
    response: unknown;
  };
  handler: RouteOptions['handler'];
};
