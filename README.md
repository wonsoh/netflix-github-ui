# Repository & Commit Explorer for GitHub

Author: Won Oh <wonsoh@live.com>

> This is the repository and commit explorer for organizations on GitHub.

## Prerequisite

Ensure you have the recent version of [Node.js & NPM](https://nodejs.org/en/download/) installed.

### Recommended

Also, install `yarn` by running

```
npm i -g yarn
```

## Getting Started

Initialize your workspace by running:

```
yarn
```

## Development Guidelines

This service is based on [Next.js](https://nextjs.org/docs/) and [React](https://reactjs.org). Please ensure to familiarize with the respective documentations for references for best development practices.

The front-end compoent is based on [Ant Design](http://ant.design/).

```
common
├── client # contains clients for external APIs
└── fixtures # some of model fixtures
components # where the stateless view components go
└── lib # some of component-level helper libraries
pages
├── api # api route handlers, as well as request builders
├── commits # commits view controller
└── org # organization view controller
styles # where the styles go
```

### GitHub Auth Keys

There is a lower rate-limit for GitHub calls for unauthenticated calls.

Please perform the following to obtain higher rates

- Visit https://github.com/settings/tokens and generate a new token with all permissions enabled.
- Export the following

```
export GITHUB_AUTH_TOKEN=<the token you received from GitHub>
```

### Running Locally

You can run your service locally by executing

```
yarn dev [-p <custom port>]
```

By default, your service will be running at `localhost:3000`, unless specified with the custom port.

### Linting

If you are using Visual Studio Code, it will perform syntax-checking and inspect code-styles.

To lint, perform,

```
yarn lint
```

### Testing

The testing is based on [Puppeteer](https://github.com/puppeteer/puppeteer), headless browser based on Chromium.

It will perform the series of tests based on fundamental functionalities.

**Make sure your dev server is running at port 3000 by running `yarn dev`.**

> Note: This will download the headless Chromium browser locally for testing.

```
yarn test-browser
```

You can also see the live testing scenes

```
yarn test-browser-visual
```

### Cleaning

To clear any cache files or dependencies installed, run

```
yarn clean
```

and then re-run `yarn` to re-install dependencies.

## Productionization

### Build command

Builds are performed by

```
[GITHUB_AUTH_TOKEN=<GitHub Auth Token>] npm run build
```

And server start scripts are run by

```
npm run start [-p <custom port>]
```

Just like local development, your service will be running at `localhost:3000`, unless specified with the custom port.

# Retrospective & Future Works
## Design
The rationale behind using Next.js is that it provides nice suite of server-side and client-side setup without having to do heavy-lifting on configuring the application.

Ant.design was used since it provides nice set of libraries for handling tabular data.

Maintaining the routing is simple and some of the request-response helpers can be shared across the browser and the server.

As we scale up, the IO operation should solely be on data-fetching (since NodeJS is best-suited for single-threaded non-blocking IO). That way, the API middleware can call other higher-scale backend microservices without having to overscale the Node.js server.

## Roadmap
Some of the future works could be:
* Securing the application with better CORS support and XSS protection.
* Provide caching support to conserve API usage resources.
* Adding more automated tests on pagination support.
* Batch request for multiple pagination support.
* Searchability of commit messages.
* Commit-discovery by specified time ranges, author, etc.
* State-saving (such as preserving previously searched repositories in the landing page) as well as back-button in the history wouldn't perform refetching of the resources.
* Using Flow types for better type-checking.
