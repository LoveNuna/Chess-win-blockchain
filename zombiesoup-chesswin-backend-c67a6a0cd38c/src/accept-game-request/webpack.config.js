var path = require("path");

module.exports = {
    entry: ['./index.ts'],
    target: 'node',
    devtool: '',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'lib'),
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    externals: {
        'aws-sdk': 'aws-sdk'
    },
     optimization: {
        minimize: false,
    }
};
