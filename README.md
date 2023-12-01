# air-bud

a companion to ESPN fantasy basketball

- the client NextJs app is in the `client` directory
- the serverless python api is in the `serverless` directory

each project has a separate deployment pipeline with Vercel

## getting started

### nextjs app

- run `npm i`
- run `npm run dev`

### serverless api

- install the vercel CLI with `npm i -g vercel`
- use the vercel CLI and run `vercel dev serverless`.
  - this initializes the serverless `app` function at `serverless/api/handler.py`

using the vercel CLI instead of running a `python3 ...` command initializes a virtual environment that matches how vercel will actually run the serverless function in production. this means no surprises when you deploy.
