import { Firma } from "./Firma";
import { Voznja } from "./Voznja";
export declare class Taksista {
    id: number;
    ime: string;
    Ime: string;
    prezime: string;
    Prezime: string;
    username: string;
    Username: string;
    password: string;
    Password: string;
    firma: Firma;
    ocena: number;
    Ocena: number;
    lista_voznji: Voznja[];
    constructor(ime: string, prezime: string, username: string, password: string, ocena: number);
}
