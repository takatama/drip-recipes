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
- [Cloudflare](https://pages.cloudflare.com/) for hosting

