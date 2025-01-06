const purgecss = [
  "@fullhuman/postcss-purgecss",
  {
    content: [
      "./pages/*.js",
      "./pages/**/*.js",
      "./components/*.js",
      "./components/**/*.js",
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
    "postcss-import",
    "tailwindcss",
    "autoprefixer",
    ...(process.env.NODE_ENV === "production" ? [purgecss] : []),
  ],
};
