"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("./auth");
var db_1 = require("../services/db");
var taxiDriver_1 = require("./taxiDriver");
var db_conn = new db_1.default();
var router = express_1.Router();
db_conn.getConnection().then(function () {
    router.post('/login', function (req, res) {
        auth_1.default.loginRequest(req, res);
    });
    router.get('/profile', function (req, res) {
        taxiDriver_1.default.getProfileData(req, res);
    });
});
exports.apiRoute = router;
//# sourceMappingURL=routes.js.map