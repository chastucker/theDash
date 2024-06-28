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

export async function getServer() {
  const server = fastify();

  await server.register(cors, {
    origin: (origin, cb) => {
      const hostname = origin ? new URL(origin).hostname : '';

      if (hostname === 'localhost') {
        cb(null, true);
        return;
      }
      cb(null, true);
      // cb(new Error('Not allowed'), false);
    },
  });

  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  await server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'The Dash Backend',
        description: 'The Dash Backend API',
        version: '0.0.1',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },

    transform: jsonSchemaTransform,
  });

  await server.register(fastifySwaggerUI, {
    routePrefix: '/docs',
  });

  server.after(() => {
    routes.forEach((route) => {
      server.withTypeProvider<ZodTypeProvider>().route(route);
    });
  });

  return server;
}
