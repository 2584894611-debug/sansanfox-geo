import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#E65F2B",
          blue: "#1A365D",
          ink: "#2D3748",
          muted: "#718096",
          soft: "#EDF2F7",
          green: "#48BB78",
          amber: "#ED8936",
          red: "#FC8181"
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "PingFang SC",
          "Microsoft YaHei",
          "sans-serif"
        ],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
