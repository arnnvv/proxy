import { Context, Hono, Next, TypedResponse } from "hono";
import { StatusCode } from "hono/utils/http-status";

const app = new Hono<{
  Bindings: {
    TARGET_URL: string;
  };
}>();

app.use(
  async (
    c: Context<
      {
        Bindings: {
          TARGET_URL: string;
        };
      },
      never,
      {}
    >,
    next: Next,
  ): Promise<void> => {
    if (!c.env.TARGET_URL || c.env.TARGET_URL.length === 0)
      throw new Error("TARGET_URL is not set");

    c.header("Access-Control-Allow-Origin", "*");
    c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    c.header("Access-Control-Allow-Credentials", "true");
    c.header("Access-Control-Expose-Headers", "Content-Length, Content-Range");

    await next();
  },
);

app.get(
  "/",
  (c: Context): Response & TypedResponse<any, StatusCode, "text"> => {
    console.log(c.env.TARGET_URL);
    return c.text(c.env.TARGET_URL);
  },
);

export default app;
