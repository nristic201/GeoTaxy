"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var Voznja_1 = require("../entities/Voznja");
var RideRepository = /** @class */ (function (_super) {
    __extends(RideRepository, _super);
    function RideRepository() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RideRepository.prototype.findDriverRide = function (driver, u_toku) {
        return this.findOne({
            vozac: driver,
            u_toku: u_toku
        });
    };
    RideRepository = __decorate([
        typeorm_1.EntityRepository(Voznja_1.Voznja)
    ], RideRepository);
    return RideRepository;
}(typeorm_1.Repository));
exports.RideRepository = RideRepository;
//# sourceMappingURL=rideRepository.js.map