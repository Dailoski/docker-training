# Building an App

In order to use docker we first need to build an app that we want to run in a container. We will use Next.js as an example.

## Creating a Next.js App

First, we need to create a Next.js app. We can do this by running the following command:

```bash
npx create-next-app@latest my-next-app
```

This will create a new directory called `my-next-app` with a new Next.js app inside. Command will also run npm install to download all app dependencies. After command is finished we can then navigate to this directory and run the development server:

```bash
cd my-next-app
npm run dev
```

This will start the development server on [http://localhost:3000](http://localhost:3000). You can open this URL in your browser to see the result.

## Configuring a Next.js App to Run Standalone

Standalone mode in Next.js creates a build with all dependencies need in for production bundled together, so that even we can just copy output files and run them even without running `npm install`. This is useful when we want to run the app in a container.

```typescript
// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // This will create a standalone build
};

export default nextConfig;
```

## Building the App

With `npm run dev` we are running the app in development mode. This means that app is running with a lot of development tools and the app is not minified nor optimized for maximal throughput that we need in production. To create an output optimized for production we need to run the following command:

```bash
npm run build
```

This will build the app and create a new directory called `.next` with all the necessary files. We can then run the app in production mode by running the following command:

```bash
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
node .next/standalone/server.js
```

This will start the app in production mode on [http://localhost:3000](http://localhost:3000). You can open this URL in your browser to see the result.

Next step is to make our app portable and package it in a docker image.
