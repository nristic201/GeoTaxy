"use strict";
exports.__esModule = true;
var express_1 = require("express");
var auth_controller_1 = require("./auth.controller");
var db_service_1 = require("../services/db.service");
var db_conn = new db_service_1["default"]();
var router = express_1.Router();
db_conn.getConnection().then(function () {
    router.post('/login', function (req, res) {
        auth_controller_1["default"].loginRequest(req, res);
    });
});
exports.apiRoute = router;
