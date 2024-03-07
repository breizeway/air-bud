# air-bud
[https://ballislyf3.net](https://ballislyf3.net/?leaderboard_safe_mode=true)

a companion to ESPN fantasy basketball. this is a personal hobby app to complement the standard ESPN fantasy basketball app for my private league. in it's initial form, it is a simple web app meant to emulate a bit of a geocities vibe. its core function is to display a leaderboard to compare overall weekly performance across the league--something the ESPN site does not provide.

it's deployed with Vercel and is set up as a NextJs / TypeScript app on the frontend and a serverless Python / Express / GraphQL api on the backend, which uses the [ESPN API package](https://github.com/cwendt94/espn-api) to retrieve private league data.

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
