import sites from "./sites.json";

const searchElement = document.querySelector("input");
if (!searchElement) throw new Error("Search element not found");

const siteElements = Array.from(
  document.getElementsByClassName(
    "site",
  ) as HTMLCollectionOf<HTMLAnchorElement>,
);

searchElement.addEventListener("input", () => {
  const searchValue = searchElement.value;
  const results = sites.map((site) => {
    if (
      site.domain.includes(searchValue) ||
      site.description.includes(searchValue)
    ) {
      return `https://${site.domain}/`;
    }
  });

  for (const siteElement of siteElements) {
    if (!results.includes(siteElement.href)) {
      siteElement.style.display = "none";
    } else {
      siteElement.style.display = "flex";
    }
  }
});
