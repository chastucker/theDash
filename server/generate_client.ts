import { server } from './src/app';
import fs from 'fs';
import orval from 'orval';

const OPENAAPI_PATH = './openapi.temp.json';

export async function generateClient() {
  await server.ready();
  const openapiSpec = server.swagger();
  await server.close();

  await fs.promises.writeFile(
    OPENAAPI_PATH,
    JSON.stringify(openapiSpec, null, 2),
  );
  await orval({
    input: { target: OPENAAPI_PATH },
    output: {
      baseUrl: 'http://localhost:4000',
      client: 'react-query',
      workspace: '../web/src/generated_client/',
      schemas: './models',
      target: './client',
      mode: 'tags-split',
      prettier: true,
    },
    hooks: {
      afterAllFilesWrite: ['prettier --write', 'eslint --fix ../web/src'],
    },
  });

  await fs.promises.unlink(OPENAAPI_PATH);
}

generateClient();
