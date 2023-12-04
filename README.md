# air-bud

a companion to ESPN fantasy basketball

- the client NextJs app is in the `client` directory
- the serverless python api is in the `serverless` directory

each project has a separate deployment pipeline with Vercel

## getting started

### nextjs app

- run `npm install --prefix client`
- run `npm run dev --prefix client`

### serverless api

- install the vercel CLI with `npm i -g vercel`
- set up the integration with vercel cli with `vercel link`. follow [these instructions](https://vercel.com/docs/cli/project-linking) to run vercel from the `./serverless` directory
- run `vercel dev`.
  - this initializes the serverless `app` function at `serverless/api/handler.py` if you linked to vercel correctly

using the vercel CLI instead of running a `python3 ...` command initializes a virtual environment to run the actual serverless function like in production. this means no surprises when you deploy.
