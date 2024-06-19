import { server } from './app';

const start = async () => {
  try {
    await server.listen({ port: 4000 });
    console.log('Running on port 4000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
