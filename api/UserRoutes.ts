import { HttpMethod, Reply, Request } from "./lib/tfetch";

interface UserInfo {
  id: string;
  name: string;
  age: number;
}

let users: UserInfo[] = [];

export function initUserRoutes() {
  return {
    ["GET::/user/info/:id"]: async (
      req: Request<{ Params: { id: string } }>,
      res: Reply
    ) => {
      const { id } = req.params;

      const user = users.find((u) => u.id === id);

      if (!user) {
        res.status(404);
        return {
          code: 404,
          error: "User not found",
        };
      }

      return {
        code: 200,
        user,

        ok: true,
      };
    },

    ["GET::/user/info2/:id"]: async (
      req: Request<{ Params: { id: string } }>,
      res: Reply
    ) => {
      const { id } = req.params;

      const user = users.find((u) => u.id === id);

      return {
        user,
      };
    },

    ["POST::/user/info"]: async (
      req: Request<{ Body: Omit<UserInfo, "id"> }>,
      res: Reply
    ) => {
      const { age, name } = req.body;

      const id = Math.floor(Math.random() * 1_000_000_000).toString();

      let user = { age, name, id };
      users.push(user);

      return {
        user,
      };
    },

    ["DELETE::/user/:id"]: async (
      req: Request<{ Params: { id: string } }>,
      res: Reply
    ) => {
      const { id } = req.params;

      let newUsers = users.filter((u) => u.id !== id);
      return {
        newUsers,
      };
    },
  };
}
