const tailwindcss = require("@tailwindcss/postcss"); // ✅ Not 'tailwindcss'
const autoprefixer = require("autoprefixer");

module.exports = {
  plugins: [tailwindcss(), autoprefixer()],
};
