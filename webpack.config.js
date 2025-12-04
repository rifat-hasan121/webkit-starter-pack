import path from "path";
import CopyPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import fs from "fs";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { fileURLToPath } from "url";
import ejs from "ejs";
import autoprefixer from "autoprefixer";

// __dirname replacement in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDirectory = path.resolve(__dirname, "src");
const partialsDirectory = path.resolve(__dirname, "src/partials");

function generateHtmlPlugins(rootDir) {
  const plugins = [];
  const files = fs.readdirSync(rootDir);
  const htmlPageFiles = files.filter((file) => path.extname(file) === ".html");
  htmlPageFiles.forEach((file) => {
    plugins.push(
      new HtmlWebpackPlugin({
        filename: file,
        template: path.join(rootDir, file),
        inject: "body",
      }),
    );
  });
  return plugins;
}

const htmlFiles = generateHtmlPlugins(rootDirectory);

// ---------- Simplified customPartialIncludePlugin ----------
function customPartialIncludePlugin() {
  return {
    name: "CustomPartialIncludePlugin",
    apply(compiler) {
      compiler.hooks.thisCompilation.tap(
        "CustomPartialIncludePlugin",
        (compilation) => {
          compilation.contextDependencies.add(partialsDirectory);

          fs.readdirSync(partialsDirectory).forEach((file) => {
            const fullPath = path.resolve(partialsDirectory, file);
            compilation.fileDependencies.add(fullPath);
          });

          HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
            "CustomPartialIncludePlugin",
            (data, cb) => {
              const regex = /<include-([\w-]+)([^>]*)\/?>/g;

              data.html = data.html.replace(
                regex,
                (match, partialName, attrString) => {
                  const attrs = {};
                  const attrRegex = /(\w+)=["']([^"']*)["']/g;
                  let matchAttr;
                  while ((matchAttr = attrRegex.exec(attrString)) !== null) {
                    attrs[matchAttr[1]] = matchAttr[2];
                  }

                  const partialPath = path.resolve(
                    partialsDirectory,
                    `${partialName}.ejs`,
                  );
                  if (!fs.existsSync(partialPath)) {
                    console.warn(`Partial not found: ${partialPath}`);
                    return "";
                  }

                  const content = fs.readFileSync(partialPath, "utf8");
                  return ejs.render(content, attrs);
                },
              );

              cb(null, data);
            },
          );
        },
      );
    },
  };
}

export default {
  entry: {
    main: "./src/assets/js/index.js",
  },
  mode: "development",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    watchFiles: ["./src/**/*", "./src/assets/css/*.css"],
    hot: false, // Disable HMR to ensure full reload on partial changes
    liveReload: true, // Enable full page reload on changes
    port: 5001,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "node_modules"),
        ],
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: { filename: "assets/fonts/[name][ext]" },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "assets/css/index.css" }),
    new CopyPlugin({ patterns: [{ from: "src/assets", to: "assets" }] }),
    ...htmlFiles,
    customPartialIncludePlugin(),
  ],
  output: {
    filename: "assets/js/index.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
};
