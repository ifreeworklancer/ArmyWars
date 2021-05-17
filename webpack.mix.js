const mix = require("laravel-mix");

mix.js("src/js/app.ts", "dist/")
    .sass("src/css/app.scss", "dist/")
    .options({
        processCssUrls: false
    })
    .webpackConfig({
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        }
    })
