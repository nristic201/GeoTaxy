"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
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
        typeorm_1.PrimaryGeneratedColumn()
    ], Voznja.prototype, "id");
    __decorate([
        typeorm_1.Column()
    ], Voznja.prototype, "lokacija_od_lat");
    __decorate([
        typeorm_1.Column()
    ], Voznja.prototype, "lokacija_od_lon");
    __decorate([
        typeorm_1.Column()
    ], Voznja.prototype, "lokacija_do_lat");
    __decorate([
        typeorm_1.Column()
    ], Voznja.prototype, "lokacija_do_lon");
    __decorate([
        typeorm_1.Column()
    ], Voznja.prototype, "ocena");
    __decorate([
        typeorm_1.Column()
    ], Voznja.prototype, "u_toku");
    __decorate([
        typeorm_1.Column()
    ], Voznja.prototype, "datum");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Taksista_1.Taksista; }, function (taxi) { return taxi.lista_voznji; }, { onDelete: 'CASCADE' }),
        typeorm_1.JoinColumn({ name: 'id_taksiste' })
    ], Voznja.prototype, "vozac");
    Voznja = __decorate([
        typeorm_1.Entity('voznja')
    ], Voznja);
    return Voznja;
}());
exports.Voznja = Voznja;
