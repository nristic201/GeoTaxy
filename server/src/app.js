"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var routes_1 = require("./controllers/routes");
var db_service_1 = require("./services/db.service");
var App = /** @class */ (function () {
    function App(port) {
        this.db_service = new db_service_1["default"]();
        this.app = express();
        this.port = port;
        this.config();
    }
    App.prototype.config = function () {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(routes_1.apiRoute);
        this.app.listen(this.port, function () {
            console.log("express pokrenut... port 3k");
        });
    };
    return App;
}());
exports["default"] = App;
