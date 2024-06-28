import { getServer } from './app';

const start = async () => {
  try {
    const server = await getServer();
    await server.listen({ port: 4000 });
    console.log('Running on port 4000');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
