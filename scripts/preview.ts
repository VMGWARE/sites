const server = Bun.serve({
  async fetch({ url }) {
    const path = new URL(url).pathname;

    if (path === "/") return new Response(Bun.file("dist/index.html"));
    if (await Bun.file(`dist${path}`).exists()) {
      return new Response(Bun.file(`dist${path}`));
    } else {
      return new Response("Not found", { status: 404 });
    }
  },
});
console.log(`Server started at ${server.url}`);
