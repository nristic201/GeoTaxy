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
            res.json(user);
        })
    }
    
}
export default new TaxiDriverController();