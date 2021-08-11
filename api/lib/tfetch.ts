import { FastifyRequest, FastifyReply } from "fastify";
import { Routes } from "../index";

// Helper types
export type Request<
  T extends { Body?: Object; Params?: Object; Querystring?: Object }
> = FastifyRequest<T>;
export type Reply = FastifyReply<any, any, any>;
export type Handler<T, U> = (req: Request<T>, res: Reply) => Promise<U>;

// Helpers to extract handlers for routes params and also responses
export type ExtractRenderParam<Type> = Type extends Handler<infer X, unknown>
  ? X
  : never;
export type ExtractRenderReturn<Type> = Type extends Handler<infer X, infer Y>
  ? Y
  : never;

// To mitigate fastify's { Body: ..., Params: ....}
type UncapitalizeObject<Type> = {
  [Property in keyof Type as `${Uncapitalize<
    string & Property
  >}`]: Type[Property];
};

// The holy grail of fetches t(yped)fetch
export function api({ baseUrl }: { baseUrl: string }) {
  return async function tfetch<T extends string & keyof Routes>(
    methodAndUrl: T,
    options?: UncapitalizeObject<ExtractRenderParam<Routes[T]>>
  ) {
    const optionsOverload = options as any;

    if (!methodAndUrl.includes("::"))
      throw new Error(`URL ${methodAndUrl} doesn't includes method`);

    let [method, url] = methodAndUrl.split("::");

    // Changing :param to it's actual value
    if (url.includes(":") && optionsOverload?.params) {
      let paramKeys = Object.keys(optionsOverload.params);

      url = url
        .split("/")
        .map((slug) => {
          if (!slug.includes(":")) return slug;

          // Find the parameter that corresponds to this :param
          let param = paramKeys.find((p) => `:${p}` === slug);

          if (!param)
            throw new Error(`Missing parameter ${slug} for URL ${url}`);

          return optionsOverload.params[param]!;
        })
        .join("/");
    }

    const response = await fetch(`${baseUrl}${url}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method,
      ...(optionsOverload?.body && {
        body: JSON.stringify(optionsOverload.body),
      }),
    });

    if (response.ok) {
      let responseJSON: ExtractRenderReturn<Routes[T]> = await response.json();
      return responseJSON;
    } else {
      return null;
    }
  };
}

// Some helper HTTP methods
export enum HttpMethod {
  GET = "GET",
  HEAD = "HEAD",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  CONNECT = "CONNECT",
  OPTIONS = "OPTIONS",
  TRACE = "TRACE",
  PATCH = "PATCH",
}
