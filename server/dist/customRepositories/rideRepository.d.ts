import { Repository } from "typeorm";
import { Voznja } from "../entities/Voznja";
import { Taksista } from "../entities/Taksista";
export declare class RideRepository extends Repository<Voznja> {
    findDriverRide(driver: Taksista, u_toku: number): Promise<Voznja | undefined>;
}
