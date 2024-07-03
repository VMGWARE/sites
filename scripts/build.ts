import { $ } from "bun";
import sites from "../src/sites.json";
import { transform } from "lightningcss";

// Setup
await $`rm -rf dist/`;
await $`mkdir -p dist`;

// Copy public files
await $`cp -r public/ dist`;

// Build CSS
export async function buildCSS() {
  const { code } = transform({
    filename: "style.css",
    code: new Uint8Array(await Bun.file("src/style.css").arrayBuffer()),
    minify: true,
  });
  return code.toString();
}
Bun.write("dist/style.css", await buildCSS());

// Build HTML
export async function buildHTML() {
  const rw = new HTMLRewriter().on("main", {
    element(el) {
      for (const site of sites) {
        el.append(
          `<a class="site" href="https://${site.domain}"><h2>${site.logo ? `<img src="${site.logo}">` : ""}${site.domain}</h2><p>${site.description}</p></a>`,
          { html: true },
        );
      }
    },
  });
  return await rw.transform(new Response(Bun.file("src/index.html"))).text();
}
Bun.write("dist/index.html", await buildHTML());

// Build JS
export async function buildJS() {
  const js = (
    await Bun.build({
      entrypoints: ["src/script.ts"],
      minify: true,
      target: "browser",
    })
  ).outputs[0].text();

  return js;
}
Bun.write("dist/script.js", await buildJS());
