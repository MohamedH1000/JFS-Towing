const purgecss = [
  "@fullhuman/postcss-purgecss",
  {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    whitelistPatterns: [
      /^slick-/,
      /^animation-/,
      /^custom-list/,
      /^circle-check/,
      /^check/,
    ],
    defaultExtractor: (content) => {
      const matches = content.match(/[\w-/:]+(?<!:)/g) || [];
      console.log(matches); // To debug the extracted class names
      return matches;
    },
  },
];
module.exports = {
  plugins: [
    "postcss-import", // Enables importing other CSS files
    "tailwindcss", // Adds Tailwind CSS processing
    "autoprefixer", // Adds vendor prefixes
  ],
};
