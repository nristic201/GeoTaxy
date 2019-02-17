import * as express from 'express';
import { TaxiDriverRepository } from '../customRepositories/taxyDriver.repository';
import { getCustomRepository } from 'typeorm';
import { Taksista } from '../entities/Taksista';

class TaxiDriverController{
    public taxiRepository: any;
    constructor(){}

    getProfileData(req:express.Request,res:express.Response){
        let username = req.query.username;
        this.taxiRepository=getCustomRepository(TaxiDriverRepository);
        this.taxiRepository.getDriverProfile(username)
        .then((user:Taksista)=>{
            let sum:number=0;
            user.lista_voznji.forEach((element:any)=>{
                sum+=element.ocena;
            })
            let ocena = sum / (user.lista_voznji.length);
            user.Ocena=ocena;
            this.taxiRepository.save(user);
            res.json(user);
        })
    }
    
}
export default new TaxiDriverController();