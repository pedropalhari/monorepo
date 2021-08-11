import "isomorphic-fetch";
import { api } from "@lib/tfetch";

const tfetch = api({
  baseUrl: "http://localhost:3000",
});

async function run() {
  let response = await tfetch("GET::/user/info/:id", {
    params: {
      id: "213",
    },
  });

  let deleteResponse = await tfetch("DELETE::/user/:id", {
    params: { id: "'12" },
  });

  console.log({ response });
}

run();
