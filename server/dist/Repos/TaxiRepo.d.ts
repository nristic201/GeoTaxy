import { Repository } from "typeorm";
import { Taksista } from "../entiteti/Taksista";
export declare class TaksistaRepository extends Repository<Taksista> {
    findByName(ime: string, prezime: string): Promise<Taksista | undefined>;
}
