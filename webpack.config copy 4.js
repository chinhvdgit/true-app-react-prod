const path = require("path");
const webpack = require('webpack');

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
    //  nó sẽ hiển thị lỗi ở đâu (vì khi lỗi nó sẽ hiển thị ở file đã build trong folder dist
    // mà khi build là cú pháp js5 cái ta cần là chính xác lỗi chỗ nào, 
    // đó là lý do bạn nên để 'inline-source-map'
    devtool: 'inline-source-map',
    devServer: {
        // contentBase: './dist',
        static: {
            directory: path.join(__dirname, 'public'),
        },
        hot: true,
        historyApiFallback: true
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
    watch: true,
    /* cấu hình file index.html từ folder public */
    plugins: [
        // HotModuleReplacementPlugin: nó giúp tạo ra server riêng tự động reload khi có bất kỳ thay đổi nào từ các file hệ client của project/
        new webpack.HotModuleReplacementPlugin(),
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
