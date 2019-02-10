import { EntityRepository, Repository } from "typeorm";
import { Taksista } from "../entities/Taksista";

@EntityRepository(Taksista)
export class TaxiDriverRepository extends Repository<Taksista>{
    findDriverByUsername(username:string){
        return this.findOne({username:username});
    }
}