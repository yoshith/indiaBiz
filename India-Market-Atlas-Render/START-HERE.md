# India Market Atlas

A complete, responsive business-research website for India. The dashboard runs in the browser without an API key or paid data service. This package also includes a dependency-free Node server so it can run as a Render Web Service with `npm start`.

## Open it now

Double-click `dist/index.html` in a modern browser. All filters, comparisons, trade tables, source links, exports and scenario calculators work locally. The separate `India-Market-Atlas.html` is the same website bundled into one portable file.

## Fix the Render deployment

The earlier package was a static site. Running `npm start` against that package caused `ENOENT` because there was no `package.json`. This updated package includes the npm start script and its Node server.

1. Unzip the download. Upload the extracted contents to the root of `yoshith/tradeIndia` on the `main` branch. In the repository's main file list, you must see `package.json`, `package-lock.json`, `server.cjs`, `render.yaml` and the `dist` folder together. Do not upload only the ZIP or put these files inside another wrapper folder.
2. In Render, use a **Web Service** with these settings:

| Setting | Value |
|---|---|
| Repository | `yoshith/tradeIndia` |
| Name | `tradeIndia` (or another available name) |
| Language | `Node` |
| Branch | `main` |
| Root directory | Leave blank |
| Build command | `npm ci` |
| Start command | `npm start` |
| Instance type | Free |
| Health check path | `/healthz` |

3. Deploy the latest commit after the files are committed to GitHub. A successful start prints `India Market Atlas listening on 0.0.0.0:10000` (or the port Render supplies). Open the service's `onrender.com` address.

To change your existing Python service, open **Settings → Build → Source → Edit**, select the same GitHub repository, then choose **Node** as the runtime and enter the commands above. Click **Deploy**. Official instructions: https://render.com/docs/native-runtimes#changing-a-services-runtime

Alternatively, use a Render Blueprint with the included `render.yaml`, which specifies a free Node Web Service. The server binds to `0.0.0.0` and Render's `PORT`; no manual port setting is needed.

Free Web Services have usage limits and spin down after 15 minutes without inbound traffic, so the next visit can take time to load. See https://render.com/docs/free and https://render.com/docs/deploy-node-express-app for the current hosting rules and Node deployment settings.

The frontend can still be hosted as a Render **Static Site** with Build Command `true` and Publish Directory `dist`. That option has no start command. See https://render.com/docs/static-sites.

This package has been prepared locally; it has not been committed to your GitHub repository or deployed to your Render account.

## Run locally with npm

Install Node.js 24, then run `npm ci` followed by `npm start` from this folder. Open http://localhost:10000. All website assets are served from `dist`; project files are not public routes. To change the listening port, set the `PORT` environment variable before starting the server.

## What is included

- **Business explorer:** 84 business models in 11 sectors, with search, sector and evidence filters. Includes panipuri, burgers, bagels, protein products, hospitals, pickleball, cricket, property, transport and trading businesses.
- **Geography:** All India, eight major city markets, and a selector covering India's states and union territories. Selecting a place with missing observations displays missing coverage, not a fabricated estimate.
- **City comparison:** Housing sales and launches for H1 2026; warehouse leasing and new additions for H2 2025. Two comparable activity indicators for each of eight metros.
- **State context:** Historical rural and urban consumption spending for 18 states, with the exact source period.
- **Growth & cooling:** Observed sector changes, published projections and indirect signals kept distinct. Includes a TRAI release dated 5 October 2026.
- **Imports & exports:** Official FY 2025–26 totals, 16 selected directional commodity rows and eight directional country rows, with search, growth threshold and sorting. Commodity and country tables are separate datasets.
- **Demand lab:** Interactive assumptions for paying buyers, purchase frequency, competing capacity, demand changes, customer share and unit economics. Inputs are illustrative; they are not local observations.
- **Sources & method:** Twelve original publications, source links, coverage limits and all index formulas.
- **Downloads:** CSV for filtered evidence; JSON for the research dataset and the current scenario.

## What the numbers mean

The website is a curated research snapshot checked on **5 October 2026**. Each figure retains its original reporting period. The site does not update itself when opened. It is not connected to sensors, restaurant order feeds, court bookings, hospital utilisation or private inventory systems.

There is no credible single public dataset covering the exact demand and operational capacity of every Indian business in every city. Unknowns remain unknown. The site gives you real published indicators, and a separate scenario calculator for what still needs local validation.

The activity index compares transactions against **new** additions. Existing available property is not included. A value above 50, or a transaction/addition ratio above one, does not prove a market shortage. The index is an explicitly defined heuristic, not an official score or a predicted investment return.

Trade figures use the **15 April 2026 release vintage** for a consistent full-year comparison and are subject to revision. March merchandise was provisional; March services was estimated. Trade values can change with prices and currency, independently of volumes. National imports do not equal city-level unmet demand.

## Change or extend the data

- Edit `dist/data.js`: publications, exact city values, state context, national signals, trade data and the business taxonomy.
- Edit `dist/app.js`: filters, calculations, view rendering and export behaviour.
- Edit `dist/styles.css`: layout, typography and colours.
- Edit `dist/index.html`: page metadata and navigation.
- `research-snapshot.json` is a portable data copy. The website reads `dist/data.js`; editing only the JSON does not change the website.

When refreshing a number, preserve its geography, units, period, original publisher, source URL and revision status. Do not replace missing category measurements with overall city population, map listing counts or a national growth rate. Verify that demand and supply refer to compatible units before introducing a new ratio.

The built-in CSV/JSON exports are downloads. There is no file-upload/import feature or server storage. “Imports & exports” in the navigation refers to international trade.

## Rebuild the portable single file

Run `python3 bundle.py` from this folder after changing the site. This recreates `India-Market-Atlas.html` from the same four source files. No packages are needed.

## Privacy and operation

All filtering and scenario calculations happen in the browser. The site has no analytics, advertisements, remote fonts, cookies or background data requests. Source links open the original publications. Scenario downloads contain the inputs you entered.

The included QA report records the checks performed on this version. Research-source authors retain rights to their publications; the package links to the originals and contains selected factual indicators, not copies of the reports.
