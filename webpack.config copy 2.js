const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const publicUrl = process.env.PUBLIC_URL;

module.exports = {
    devServer: {
        devMiddleware: {
            publicPath: 'public'
        },
    },
    entry: path.resolve(__dirname, "index.js"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.bundle.js",
        clean: true,
    },
    /* đoạn code sau sẽ load các gói babel vào webpack */
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "public", "index.html"),
        }),
    ],
};
