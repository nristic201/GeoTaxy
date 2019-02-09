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
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Taksista.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Taksista.prototype, "ime", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Taksista.prototype, "prezime", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Taksista.prototype, "username", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Taksista.prototype, "password", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Firma_1.Firma; }, function (firma) { return firma.lista_vozaca; }, { onDelete: 'CASCADE' }),
        typeorm_1.JoinColumn({ name: "id_firme" }),
        __metadata("design:type", Firma_1.Firma)
    ], Taksista.prototype, "firma", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Taksista.prototype, "ocena", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return Voznja_1.Voznja; }, function (voznja) { return voznja.vozac; }),
        __metadata("design:type", Array)
    ], Taksista.prototype, "lista_voznji", void 0);
    Taksista = __decorate([
        typeorm_1.Entity('taksista'),
        __metadata("design:paramtypes", [String, String, String, String, Number])
    ], Taksista);
    return Taksista;
}());
exports.Taksista = Taksista;
//# sourceMappingURL=Taksista.js.map