import { Firma } from "../entiteti/Firma";
import { EntityRepository, Repository } from "typeorm";


@EntityRepository(Firma)
export class FirmaRepo extends Repository<Firma> {
    
}