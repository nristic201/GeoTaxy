"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Taksista_1 = require("./Taksista");
var typeorm_1 = require("typeorm");
var Voznja = /** @class */ (function () {
    function Voznja(lokacija_od_lat, lokacija_od_lon, lokacija_do_lat, lokacija_do_lon, ocena, u_toku, datum) {
        this.lokacija_do_lat = lokacija_do_lat;
        this.lokacija_do_lon = lokacija_do_lon;
        this.lokacija_od_lat = lokacija_od_lat;
        this.lokacija_od_lon = lokacija_od_lon;
        this.ocena = ocena;
        this.u_toku = u_toku;
        this.datum = datum;
    }
    Object.defineProperty(Voznja.prototype, "Vozac", {
        get: function () {
            return this.vozac;
        },
        set: function (value) {
            this.vozac = value;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Voznja.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Voznja.prototype, "lokacija_od_lat", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Voznja.prototype, "lokacija_od_lon", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Voznja.prototype, "lokacija_do_lat", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Voznja.prototype, "lokacija_do_lon", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Voznja.prototype, "ocena", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Voznja.prototype, "u_toku", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Date)
    ], Voznja.prototype, "datum", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Taksista_1.Taksista; }, function (taxi) { return taxi.lista_voznji; }, { onDelete: 'CASCADE' }),
        typeorm_1.JoinColumn({ name: 'id_taksiste' }),
        __metadata("design:type", Taksista_1.Taksista)
    ], Voznja.prototype, "vozac", void 0);
    Voznja = __decorate([
        typeorm_1.Entity('voznja'),
        __metadata("design:paramtypes", [String, String, String, String, Number, Number, Date])
    ], Voznja);
    return Voznja;
}());
exports.Voznja = Voznja;
//# sourceMappingURL=Voznja.js.map