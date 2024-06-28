import { Context, Hono, Next, TypedResponse } from "hono";
import { StatusCode } from "hono/utils/http-status";
import { createProxyMiddleware } from "http-proxy-middleware";

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

    /*
     * hono dosen't support proxy
    createProxyMiddleware({
      target: c.env.TARGET_URL,
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {},
      onProxyRes: (proxyRes, req, res) => {},
    });
    */
    await next();
  },
);

app.get("/", (c: Context): Response & TypedResponse<any, StatusCode, "text"> =>
  c.text(c.env.TARGET_URL),
);

export default app;
