"use strict";
exports.__esModule = true;
var taxyDriver_repository_1 = require("../customRepositories/taxyDriver.repository");
var typeorm_1 = require("typeorm");
var AuthController = /** @class */ (function () {
    function AuthController() {
        var _this = this;
        this.loginRequest = function (req, res) {
            var username = req.body.username;
            var password = req.body.password;
            _this.taxiRepository = typeorm_1.getCustomRepository(taxyDriver_repository_1.TaxiDriverRepository);
            _this.taxiRepository.findDriverByUsername(username)
                .then(function (user) {
                if (user.password === password) {
                    res.json(user);
                }
                res.json({
                    error: "wrong data"
                });
            });
        };
    }
    return AuthController;
}());
exports["default"] = new AuthController();
