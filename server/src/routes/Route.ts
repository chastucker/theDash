import { RouteOptions } from 'fastify';

type DefaultType = { P?: unknown; B?: unknown; R?: unknown };

export type Route<T extends Partial<DefaultType> = DefaultType> = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  schema: {
    description: string;
    tags: string[];
    params?: T['P'];
    body?: T['B'];
    response: T['R'];
  };
  handler: RouteOptions['handler'];
};
