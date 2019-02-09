import { Taksista } from "./Taksista";
export declare class Firma {
    id: number;
    naziv: string;
    sediste: string;
    email: string;
    telefon: string;
    lista_vozaca: Taksista[];
    Lista_vozaca: Taksista[];
    constructor(naziv: string, sediste: string, email: string, telefon: string);
}
