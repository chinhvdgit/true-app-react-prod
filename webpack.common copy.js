const path = require('path');

module.exports = {
    // entry chinh de bundle
    entry: ['./src/js/index.js', './src/sass/index.scss'],
    output: {
        filename: 'js/index.js',
        path: path.resolve(__dirname, 'dist')
    },
    // node: {
    //     dgram: 'empty',
    //     fs: 'empty',
    //     net: 'empty',
    //     tls: 'empty',
    //     child_process: 'empty',
    // },
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
            }
        ]
    },
    resolve: {
        fallback: {
            dgram: false,
            fs: false,
            net: false,
            tls: false,
            child_process: false
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.jpg'],
        alias: {
            "@Layouts": path.resolve(__dirname, "src/app/layouts/"),
            "@Components": path.resolve(__dirname, "src/app/components/"),
            "@Images": path.resolve(__dirname, "src/images/"),
            "@Store": path.resolve(__dirname, "src/app/store/"),
            "@Utils": path.resolve(__dirname, "src/app/utils"),
            "@Styles": path.resolve(__dirname, 'src/app/styles/'),
            "@Pages": path.resolve(__dirname, 'src/app/pages/'),
            "@Services": path.resolve(__dirname, 'src/app/services/'),
            "@Models": path.resolve(__dirname, 'src/app/models/'),
            "@Core": path.resolve(__dirname, 'src/app/core/'),
            "@Config": path.resolve(__dirname, "src/app/config/")
        }
    },
}