"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var Taksista_1 = require("./Taksista");
var Firma = /** @class */ (function () {
    function Firma(
    // id: number,
    naziv, sediste, email, telefon) {
        // this.id = id;
        this.naziv = naziv;
        this.sediste = naziv;
        this.email = email;
        this.telefon = telefon;
    }
    Object.defineProperty(Firma.prototype, "Lista_vozaca", {
        get: function () {
            return this.lista_vozaca;
        },
        set: function (value) {
            this.lista_vozaca = value;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        typeorm_1.PrimaryGeneratedColumn({ type: 'integer' })
    ], Firma.prototype, "id");
    __decorate([
        typeorm_1.Column({ type: 'varchar' })
    ], Firma.prototype, "naziv");
    __decorate([
        typeorm_1.Column({ type: 'varchar' })
    ], Firma.prototype, "sediste");
    __decorate([
        typeorm_1.Column({ type: 'varchar' })
    ], Firma.prototype, "email");
    __decorate([
        typeorm_1.Column({ type: 'varchar' })
    ], Firma.prototype, "telefon");
    __decorate([
        typeorm_1.OneToMany(function (type) { return Taksista_1.Taksista; }, function (taxi) { return taxi.firma; })
    ], Firma.prototype, "lista_vozaca");
    Firma = __decorate([
        typeorm_1.Entity('firma')
    ], Firma);
    return Firma;
}());
exports.Firma = Firma;
