"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var taxyDriver_repository_1 = require("../customRepositories/taxyDriver.repository");
var typeorm_1 = require("typeorm");
var TaxiDriverController = /** @class */ (function () {
    function TaxiDriverController() {
    }
    TaxiDriverController.prototype.getProfileData = function (req, res) {
        var username = req.query.username;
        this.taxiRepository = typeorm_1.getCustomRepository(taxyDriver_repository_1.TaxiDriverRepository);
        this.taxiRepository.getDriverProfile(username)
            .then(function (user) {
            res.json(user);
        });
    };
    return TaxiDriverController;
}());
exports.default = new TaxiDriverController();
//# sourceMappingURL=taxiDriver.js.map