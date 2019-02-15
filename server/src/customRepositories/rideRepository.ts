import { EntityRepository, Repository } from "typeorm";
import { Voznja } from "../entities/Voznja";
import { Taksista } from "../entities/Taksista";


@EntityRepository(Voznja)
export class RideRepository extends Repository<Voznja>{
    findDriverRide(driver:Taksista,u_toku:number){
        return this.findOne({
            vozac:driver,
            u_toku:u_toku
        });
    }
    findRideByID(id:number){
        return this.findOne({id:id})
    }
   

}