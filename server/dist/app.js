"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var routes_1 = require("./controllers/routes");
var amqp_1 = require("./services/amqp");
var broker_1 = require("./controllers/broker");
var App = /** @class */ (function () {
    function App(port) {
        this.amqp_service = new amqp_1.default();
        this.amqpService = new amqp_1.default();
        this.app = express();
        this.port = port;
        this.config();
    }
    App.prototype.config = function () {
        var _this = this;
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(routes_1.apiRoute);
        this.app.listen(this.port, function () {
            console.log("express pokrenut... port 3k");
            _this.amqp_service.getAMQPConnection().then(function (conn) {
                _this.broker = new broker_1.default(conn);
                _this.broker.start();
            });
        });
    };
    return App;
}());
exports.default = App;
//# sourceMappingURL=app.js.map