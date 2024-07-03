# VMG Ware Sites
A easy to view, list of all websites, domains, and subdomains that VMG Ware has or runs!

## Build instructions

1. Clone the repo.
   ```sh
   git clone https://github.com/VMGWare/sites.git
   cd sites
   ```

2. Install dependencies and start the development server.
   ```sh
   bun install
   bun dev
   ```

3. Build the site.
   ```sh
   bun run build
   bun preview # This will start a preview server. Do not use this for production.
   ```
   This will build the site and place the files in `dist/`. You can serve the files from there however you like.
