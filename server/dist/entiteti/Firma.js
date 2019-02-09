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
const typeorm_1 = require("typeorm");
const Taksista_1 = require("./Taksista");
let Firma = class Firma {
    constructor(
    // id: number,
    naziv, sediste, email, telefon) {
        // this.id = id;
        this.naziv = naziv;
        this.sediste = naziv;
        this.email = email;
        this.telefon = telefon;
    }
    get Lista_vozaca() {
        return this.lista_vozaca;
    }
    set Lista_vozaca(value) {
        this.lista_vozaca = value;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: 'integer' }),
    __metadata("design:type", Number)
], Firma.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar' }),
    __metadata("design:type", String)
], Firma.prototype, "naziv", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar' }),
    __metadata("design:type", String)
], Firma.prototype, "sediste", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar' }),
    __metadata("design:type", String)
], Firma.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar' }),
    __metadata("design:type", String)
], Firma.prototype, "telefon", void 0);
__decorate([
    typeorm_1.OneToMany(type => Taksista_1.Taksista, taxi => taxi.firma),
    __metadata("design:type", Array)
], Firma.prototype, "lista_vozaca", void 0);
Firma = __decorate([
    typeorm_1.Entity('firma'),
    __metadata("design:paramtypes", [String, String, String, String])
], Firma);
exports.Firma = Firma;
//# sourceMappingURL=Firma.js.map