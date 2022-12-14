const path = require("path");

const Dotenv = require('dotenv-webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

/* thêm html-webpack-plugin vào file cấu hình */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("interpolate-html-plugin");

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, "src/index.tsx"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.bundle.js",
        // clean: true,
    },
    module: {
        rules: [
            {
                // các file .js or .jsx được loader bởi 'babel-loader'
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: [/node_modules/] // nó sẽ không tìm trong folder /node_modules
            },
            {
                test: /\.tsx?$/, include: /src/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            compact: true,
                            plugins: [
                            ]
                        },
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            // Disable type checker - we will use it in fork plugin.
                            transpileOnly: true
                        }
                    },
                    'ts-nameof-loader'
                ]
            },
            {
                test: /\.(gif|png|jpe?g|svg|ttf|woff|woff2|eot)$/i,
                use: ['file-loader']
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }
        ]
    },
    /* cấu hình file index.html từ folder public */
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new Dotenv({
        }),
        new InterpolateHtmlPlugin({
            'PUBLIC_URL': '' // can modify `static` to another name or get it from `process`
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.join(__dirname, "public", "index.html"),
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.jpg'],
        alias: {
            "@Layouts": path.resolve(__dirname, "src/layouts/"),
            "@Components": path.resolve(__dirname, "src/components/"),
            "@Images": path.resolve(__dirname, "src/images/"),
            "@Store": path.resolve(__dirname, "src/store/"),
            "@Utils": path.resolve(__dirname, "src/utils"),
            "@Styles": path.resolve(__dirname, 'src/styles/'),
            "@Pages": path.resolve(__dirname, 'src/pages/'),
            "@Services": path.resolve(__dirname, 'src/services/'),
            "@Models": path.resolve(__dirname, 'src/models/'),
            "@Core": path.resolve(__dirname, 'src/core/'),
            "@Config": path.resolve(__dirname, "src/config/")
        }
    },
};
