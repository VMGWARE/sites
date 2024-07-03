import { $, type Serve } from "bun";
import { watch } from "node:fs";
import { buildCSS, buildHTML, buildJS } from "./build";

const serverOptions: Serve = {
  async fetch({ url }) {
    const path = new URL(url).pathname;

    switch (path) {
      case "/":
        return new Response(await buildHTML(), {
          headers: {
            "Content-Type": "text/html",
          },
        });
      case "/style.css":
        return new Response(await buildCSS(), {
          headers: {
            "Content-Type": "text/css",
          },
        });
      case "/script.js":
        return new Response(await buildJS(), {
          headers: {
            "Content-Type": "application/javascript",
          },
        });
      default:
        if (await Bun.file(`public${path}`).exists()) {
          return new Response(Bun.file(`public${path}`));
        }
        return new Response("Not found", { status: 404 });
    }
  },
};

const server = Bun.serve(serverOptions);
console.log(`Server started on ${server.url}`);

watch("src/", () => {
  server.reload(serverOptions);
  console.log("Reloaded.");
});
