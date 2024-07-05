import { getServer } from './src/app';
import fs from 'fs';
import orval from 'orval';

const OPENAAPI_PATH = './openapi.temp.json';

function getBaseurl() {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  throw new Error('BASE_URL not defined');
}

export async function generateClient() {
  const server = await getServer();
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
      baseUrl: getBaseurl(),
      client: 'react-query',
      workspace: '../web/src/generated_client/',
      schemas: './models',
      target: './client',
      mode: 'tags-split',
      prettier: true,
      override: {
        mutator: {
          path: '../utils/axiosInstance.ts',
          name: 'useCustomInstance',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: ['prettier --write', 'eslint --fix ../web/src'],
    },
  });

  await fs.promises.unlink(OPENAAPI_PATH);
}

generateClient();
