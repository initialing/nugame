const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    mode: "development",
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "canvas/index.html"),
            title: "数字游戏"
        })
    ],
    entry: "./canvas/game.js",
    output: {
        filename: "game.js",
        path: __dirname + "/dist"
    }
}