# Drip Recipes - Perfect Your Pour Over

A precision coffee brewing timer that helps you achieve the perfect cup, no matter which pour-over method you use. Select from multiple brewing recipes and get guided steps to ensure consistent and delicious coffee every time.

## Features

### 🎯 Smart Brewing Guidance
- Visual progress tracker for each recipe
- Animated pour guides with precise timing
- Voice countdown to assist in pouring accuracy
- Available in **English and Japanese**

### ⚙️ Fully Customizable
- Select from multiple brewing methods
- Adjust **coffee amount**, **grind size**, and **water temperature**
- Fine-tune **taste balance** and **brew strength**
- Get precise **water measurements** for each step

## Tips for Better Brewing

- **Adjust your grind size** based on extraction time; if water drains too slowly, go coarser.
- **Experiment with pour timing** to balance acidity and sweetness.

## Quick Start

1. Visit [Drip Recipes](https://drip-recipes.pages.dev/)
2. Select your preferred brewing method
3. Adjust settings to match your beans and taste preferences
4. Follow the guided steps
5. Enjoy your perfect cup of coffee!

## For Developers

Built with **React + TypeScript**, featuring:
- **Tailwind CSS** for responsive UI
- **Voice synthesis (SSML)** for guided brewing instructions
- **Cloudflare Pages** for fast and reliable hosting

### Voice Guidance
The app uses **SSML (Speech Synthesis Markup Language)** to create natural-sounding countdown voice cues before each step:

```xml
<speak>
  <par>
    <media xml:id="three" begin="0s">
      <speak><prosody rate="x-fast">3</prosody></speak>
    </media>

    <media xml:id="two" begin="three.begin+1.0s">
      <speak><prosody rate="x-fast">2</prosody></speak>
    </media>

    <media xml:id="one" begin="two.begin+1.0s">
      <speak><prosody rate="x-fast">1</prosody></speak>
    </media>

    <media begin="one.begin+1.0s">
      <speak><prosody rate="medium">Next Step!</prosody></speak>
    </media>
  </par>
</speak>
```

Uses **Google Cloud Text-to-Speech Wavenet voices**:

- **English**
  - Male: `en-US-Wavenet-J`
  - Female: `en-US-Wavenet-H`
- **Japanese**
  - Male: `ja-JP-Wavenet-D`
  - Female: `ja-JP-Wavenet-B`

### Development Setup

```bash
git clone https://github.com/takatama/drip-recipes.git
cd drip-recipes
npm install
npm run dev
```

## License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## Contributing
Contributions are welcome! Please **open an issue** or **submit a pull request** to suggest changes or improvements.

## Acknowledgements
- [Tetsu Kasuya](https://www.instagram.com/tetsukasuya/) for creating the 4:6 method and the new hybrid method.
- [James Hoffmann](https://www.jameshoffmann.co.uk/) for creating the V60 technique.
- [Cloudflare](https://pages.cloudflare.com/) for hosting.
- [Unsplash](https://unsplash.com/) for images.

# Next.js

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`c3`](https://developers.cloudflare.com/pages/get-started/c3).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Cloudflare integration

Besides the `dev` script mentioned above `c3` has added a few extra scripts that allow you to integrate the application with the [Cloudflare Pages](https://pages.cloudflare.com/) environment, these are:
  - `pages:build` to build the application for Pages using the [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages) CLI
  - `preview` to locally preview your Pages application using the [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI
  - `deploy` to deploy your Pages application using the [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI

> __Note:__ while the `dev` script is optimal for local development you should preview your Pages application as well (periodically or before deployments) in order to make sure that it can properly work in the Pages environment (for more details see the [`@cloudflare/next-on-pages` recommended workflow](https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md#recommended-development-workflow))

### Bindings

Cloudflare [Bindings](https://developers.cloudflare.com/pages/functions/bindings/) are what allows you to interact with resources available in the Cloudflare Platform.

You can use bindings during development, when previewing locally your application and of course in the deployed application:

- To use bindings in dev mode you need to define them in the `next.config.js` file under `setupDevBindings`, this mode uses the `next-dev` `@cloudflare/next-on-pages` submodule. For more details see its [documentation](https://github.com/cloudflare/next-on-pages/blob/05b6256/internal-packages/next-dev/README.md).

- To use bindings in the preview mode you need to add them to the `pages:preview` script accordingly to the `wrangler pages dev` command. For more details see its [documentation](https://developers.cloudflare.com/workers/wrangler/commands/#dev-1) or the [Pages Bindings documentation](https://developers.cloudflare.com/pages/functions/bindings/).

- To use bindings in the deployed application you will need to configure them in the Cloudflare [dashboard](https://dash.cloudflare.com/). For more details see the  [Pages Bindings documentation](https://developers.cloudflare.com/pages/functions/bindings/).

#### KV Example

`c3` has added for you an example showing how you can use a KV binding.

In order to enable the example:
- Search for javascript/typescript lines containing the following comment:
  ```ts
  // KV Example:
  ```
  and uncomment the commented lines below it (also uncomment the relevant imports).
- In the `wrangler.jsonc` file add the following configuration line:
  ```
  "kv_namespaces": [{ "binding": "MY_KV_NAMESPACE", "id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }],
  ```
- If you're using TypeScript run the `cf-typegen` script to update the `env.d.ts` file:
  ```bash
  npm run cf-typegen
  # or
  yarn cf-typegen
  # or
  pnpm cf-typegen
  # or
  bun cf-typegen
  ```

After doing this you can run the `dev` or `preview` script and visit the `/api/hello` route to see the example in action.

Finally, if you also want to see the example work in the deployed application make sure to add a `MY_KV_NAMESPACE` binding to your Pages application in its [dashboard kv bindings settings section](https://dash.cloudflare.com/?to=/:account/pages/view/:pages-project/settings/functions#kv_namespace_bindings_section). After having configured it make sure to re-deploy your application.
