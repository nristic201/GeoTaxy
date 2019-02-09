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
const Firma_1 = require("./Firma");
const Voznja_1 = require("./Voznja");
const typeorm_1 = require("typeorm");
let Taksista = class Taksista {
    constructor(ime, prezime, username, password, ocena) {
        this.ime = ime;
        this.prezime = prezime;
        this.username = username;
        this.password = password;
        this.ocena = ocena;
    }
    get Ime() {
        return this.ime;
    }
    set Ime(value) {
        this.ime = value;
    }
    get Prezime() {
        return this.prezime;
    }
    set Prezime(value) {
        this.prezime = value;
    }
    get Username() {
        return this.username;
    }
    set Username(value) {
        this.username = value;
    }
    get Password() {
        return this.password;
    }
    set Password(value) {
        this.password = value;
    }
    get Ocena() {
        return this.ocena;
    }
    set Ocena(value) {
        this.ocena = value;
    }
};
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
    typeorm_1.ManyToOne(type => Firma_1.Firma, firma => firma.lista_vozaca, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: "id_firme" }),
    __metadata("design:type", Firma_1.Firma)
], Taksista.prototype, "firma", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Taksista.prototype, "ocena", void 0);
__decorate([
    typeorm_1.OneToMany(type => Voznja_1.Voznja, voznja => voznja.vozac),
    __metadata("design:type", Array)
], Taksista.prototype, "lista_voznji", void 0);
Taksista = __decorate([
    typeorm_1.Entity('taksista'),
    __metadata("design:paramtypes", [String, String, String, String, Number])
], Taksista);
exports.Taksista = Taksista;
//# sourceMappingURL=Taksista.js.map