# The Dash

An application that stores users' patient data and displays it as a dashboard. Users can add, edit, and delete patients, create custom columns, and store custom data about each patient. Users can also filter and sort through their data.

## Installation

1. Pull the code down: `git clone https://github.com/chastucker/theDash.git`
2. Install
   1. [NodeJS](https://nodejs.org/en)
   2. [Postgres SQL](https://www.postgresql.org/download/)
3. Start a new supabase project
   1. Go to [Supabase](https://supabase.com/)
   2. Sign up or login to an existing account
   3. Create a new project
4. Add environment variables
   1. Make a .env file in server directory
   2. Add the following environment variables
      - SUPABASE_URL - the supabase's project url
      - SUPABASE_ANON_KEY - the supabase's anon key found in `supabase.com/dashboard/project/{supabase_project_id}/settings/api`
      - SUPABASE_SERVICE_ROLE_SECRET - the supabase's service_role key found in `supabase.com/dashboard/project/{supabase_project_id}/settings/api`
      - DATABASE_URL - In the form of `postgres://postgres.{supabase_project_id}:{database_password}@{region_of_project}.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`
      - DIRECT_URL In the form of `postgres://postgres.{supabase_project_id}:{database_password}@{region_of_project}.pooler.supabase.com:5432/postgres`
5. start the project
   - Open up a terminal and run `cd server; npm run generateclient; npx prisma migrate:dev; npm run dev`
   - In another terminal window open `cd web; npm run dev`

## Layout

### Server Side

- prisma/ - Holds the prisma migrations
- src/ - Holds the application logic
  - routes/ - Holds all of the routes of the service. Each folder is a route group
  - app.ts - Registers the fastify plug-ins, as well as the routes
  - supabaseAdmin.ts - Creates the supabase client and gets the supabase keys
  - index.ts - Starts the application

### Web Side

- `src/` - Holds the application logic
  - `app/` - the app directory of next js. You can find more information about the app directory [here](https://nextjs.org/docs/app)
  - `login\` - Holds the login page logic
  - `Provider.tsx` - Holds the Providers that need to wrap the application code. Currently this holds react query provider
  - `layout.tsx` - The global layout of the application. More information can be found [here](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- `components/` - Holds the components that are used in the app directory pages
  - `dashboard/` - The main dashboard component
  - `forms/` - Holds the forms of the application
  - `table/` - Holds the tanstack react table logic
  - `ui/` - Holds the shad-cdn generated components
  - `Header.tsx` - The header component of the main page
- `lib/` - Holds the mandatory file for shadcdn
- `utils/` - Holds the refresh logic for sessions
- `eslintrc.json` - The ESLint configuration file
- `component.json` - The shad-cdn configuration file
- `next.config.mjs` - The NextJS configuration file
- `tailwind.config` - the tailwindcss configuration file

## Technologies used

### Server Side

- [Fastify](https://fastify.dev/) - Web framework
- [fastify-type-provider-zod](https://github.com/turkerdev/fastify-type-provider-zod) - Plugin for zod to work with fastify
- [Prisma](https://www.prisma.io/) - Used for migrations and as a ORM
- [Prisma Multischema](https://github.com/joydip007x/Prisma-MultiSchema) - used to separate the prisma files. To make new migrations you first need to follow these set up instructions
- [swagger](https://swagger.io/) and [fastify-swagger](https://github.com/fastify/fastify-swagger) - Used for documenting the backend routes and to generate client code for calling routes
- [Orval](https://orval.dev/) - Used the swagger docs to generate client code for calling routes
- [Zod](https://zod.dev/) - Typing routes

### Web Side

- [axios](https://www.npmjs.com/package/axios) - Used to make http requests
- [flowbite-react](https://flowbite-react.com/docs/components/datepicker) - Used their Date Picker
- [NextJS](https://nextjs.org/) - Used as the frontend framework
- [react-hook-form](https://react-hook-form.com/) - used to handle form logic
- [shad-cdn](https://ui.shadcn.com/) - Used as a ui component logic
- [Tailwind](https://tailwindcss.com/) - Used for styling components
- [tanstack/react-query](https://tanstack.com/router/) - Used to make http calls and hold http state logic
- [tanstack/react-table](https://tanstack.com/table) - Headless UI table library used to build tables and handle table state

## Future State

- Sorting by custom fields
- Add more custom field types (files)
- Add avatars images
