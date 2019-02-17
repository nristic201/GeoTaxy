"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var port = process.env.PORT || 3000;
new app_1.default(port);
process.on("uncaughtException", function (err) {
    console.error(err);
});
//# sourceMappingURL=server.js.map