const path = require("path");
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const Dotenv = require('dotenv-webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

/* thêm html-webpack-plugin vào file cấu hình */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("interpolate-html-plugin");


// global variables
const rootPath = path.resolve(__dirname)
const distPath = rootPath + '/src/_metronic/assets'


module.exports = merge(common, {
    mode: 'development',
    entry: { 'main-client': './src/boot-client.tsx' },
    // entry: path.resolve(__dirname, "src/index.tsx"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.bundle.js",
        publicPath: '/'
    },
    //  nó sẽ hiển thị lỗi ở đâu (vì khi lỗi nó sẽ hiển thị ở file đã build trong folder dist
    // mà khi build là cú pháp js5 cái ta cần là chính xác lỗi chỗ nào, 
    // đó là lý do bạn nên để 'inline-source-map'
    devtool: 'inline-source-map',
    // devServer: {
    //     // contentBase: './dist',
    //     static: {
    //         directory: path.join(__dirname, 'public'),
    //     },
    //     hot: true,
    //     historyApiFallback: true
    // },
    devServer: {
        contentBase: './dist',
        hot: true,
        historyApiFallback: true
    },
    module: {
        // các file scss được loader bởi style-loader, css-loader, sass-loader
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },
    watch: true,
    /* cấu hình file index.html từ folder public */
    plugins: [
        // HotModuleReplacementPlugin: nó giúp tạo ra server riêng tự động reload khi có bất kỳ thay đổi nào từ các file hệ client của project/
        new webpack.HotModuleReplacementPlugin(),
        // new MiniCssExtractPlugin({
        //     filename: '[name].css',
        // }),
        new Dotenv({
        }),
        new InterpolateHtmlPlugin({
            'PUBLIC_URL': '' // can modify `static` to another name or get it from `process`
        }),
        // new HtmlWebpackPlugin({
        //     inject: true,
        //     template:  path.join(__dirname, "public", "index.html"), //'public/index.html' //
        // })
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        })
    ]
});
