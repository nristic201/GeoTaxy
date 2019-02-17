import { Repository } from "typeorm";
import { Taksista } from "../entities/Taksista";
export declare class TaxiDriverRepository extends Repository<Taksista> {
    findDriverByUsername(username: string): Promise<Taksista | undefined>;
    getDriverProfile(username: string): Promise<Taksista | undefined>;
}
