import fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import cors from '@fastify/cors';

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { routes } from './routes';

export const server = fastify();

server.register(cors, {
  origin: (origin, cb) => {
    const hostname = origin ? new URL(origin).hostname : '';
    if (hostname === 'localhost') {
      cb(null, true);
      return;
    }
    cb(new Error('Not allowed'), false);
  },
});

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'The Dash Backend',
      description: 'The Dash Backend API',
      version: '0.0.1',
    },
    servers: [],
  },

  transform: jsonSchemaTransform,
});

server.register(fastifySwaggerUI, {
  routePrefix: '/docs',
});

server.after(() => {
  routes.forEach((route) => {
    server.withTypeProvider<ZodTypeProvider>().route(route);
  });
});
