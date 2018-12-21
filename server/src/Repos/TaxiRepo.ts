import { EntityRepository, Repository } from "typeorm";
import { Taksista } from "../entiteti/Taksista";

@EntityRepository(Taksista)
export class TaksistaRepository extends Repository<Taksista>{
    findByName(ime:string,prezime:string){
        return this.findOne({ime,prezime});
    }
}