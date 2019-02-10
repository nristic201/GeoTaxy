import { Taksista } from "./Taksista";
export declare class Voznja {
    id: number;
    lokacija_od_lat: string;
    lokacija_od_lon: string;
    lokacija_do_lat: string;
    lokacija_do_lon: string;
    ocena: number;
    u_toku: number;
    datum: Date;
    vozac: Taksista;
    Vozac: Taksista;
    constructor(lokacija_od_lat: string, lokacija_od_lon: string, lokacija_do_lat: string, lokacija_do_lon: string, ocena: number, u_toku: number, datum: Date);
}
