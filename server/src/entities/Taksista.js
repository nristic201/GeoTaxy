"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var Firma_1 = require("./Firma");
var Voznja_1 = require("./Voznja");
var typeorm_1 = require("typeorm");
var Taksista = /** @class */ (function () {
    function Taksista(ime, prezime, username, password, ocena) {
        this.ime = ime;
        this.prezime = prezime;
        this.username = username;
        this.password = password;
        this.ocena = ocena;
    }
    Object.defineProperty(Taksista.prototype, "Ime", {
        get: function () {
            return this.ime;
        },
        set: function (value) {
            this.ime = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Taksista.prototype, "Prezime", {
        get: function () {
            return this.prezime;
        },
        set: function (value) {
            this.prezime = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Taksista.prototype, "Username", {
        get: function () {
            return this.username;
        },
        set: function (value) {
            this.username = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Taksista.prototype, "Password", {
        get: function () {
            return this.password;
        },
        set: function (value) {
            this.password = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Taksista.prototype, "Ocena", {
        get: function () {
            return this.ocena;
        },
        set: function (value) {
            this.ocena = value;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Taksista.prototype, "id");
    __decorate([
        typeorm_1.Column()
    ], Taksista.prototype, "ime");
    __decorate([
        typeorm_1.Column()
    ], Taksista.prototype, "prezime");
    __decorate([
        typeorm_1.Column()
    ], Taksista.prototype, "username");
    __decorate([
        typeorm_1.Column()
    ], Taksista.prototype, "password");
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Firma_1.Firma; }, function (firma) { return firma.lista_vozaca; }, { onDelete: 'CASCADE' }),
        typeorm_1.JoinColumn({ name: "id_firme" })
    ], Taksista.prototype, "firma");
    __decorate([
        typeorm_1.Column()
    ], Taksista.prototype, "ocena");
    __decorate([
        typeorm_1.OneToMany(function (type) { return Voznja_1.Voznja; }, function (voznja) { return voznja.vozac; })
    ], Taksista.prototype, "lista_voznji");
    Taksista = __decorate([
        typeorm_1.Entity('taksista')
    ], Taksista);
    return Taksista;
}());
exports.Taksista = Taksista;
