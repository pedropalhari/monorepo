import fastify, { FastifyReply, FastifyRequest, HTTPMethods } from "fastify";
import { HttpMethod, api } from "./lib/tfetch";
import { initUserRoutes } from "./UserRoutes";

const app = fastify();

export type Routes = ReturnType<typeof initUserRoutes>;

async function run() {
  const routes: Routes = {
    ...initUserRoutes(),
  };

  Object.keys(routes).forEach((methodAndUrl) => {
    let handler = routes[methodAndUrl as keyof Routes];

    console.log(`Initializing ${methodAndUrl}`);

    if (!methodAndUrl.includes("::"))
      throw new Error(`URL ${methodAndUrl} doesn't includes method`);

    let [method, url] = methodAndUrl.split("::");

    //@ts-ignore
    app.route({ url, method, handler });
  });

  await app.listen(3000);
  console.log(`\nRunning on http://localhost:3000`);
}

run();
