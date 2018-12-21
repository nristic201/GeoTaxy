import 'reflect-metadata'
import express from "express";
import { createConnection, getManager, getCustomRepository } from "typeorm";
import { Taksista } from "./entiteti/Taksista";
import { Firma } from "./entiteti/Firma";
import { emit } from "cluster";
import { TaksistaRepository } from './Repos/TaxiRepo';
import { Voznja } from './entiteti/Voznja';

const db = require('../src/modules/ormconfig')
createConnection(db).then(async conn => {
    console.log('konekcija otvorena');
    //dodavanje nove Firme 
    let f1 = new Firma('Prvi Taxi', 'Nis', 'prvitaxi018@gmail.com', '018 111 111');
    await conn.getRepository(Firma).save(f1);
    //citanje firme iz baze
    let f2 = await conn.getRepository(Firma).find({ naziv: 'Prvi Taxi' });

    //brisanje firme iz baze
    conn.getRepository(Firma).delete(f2).then(async () => {
        let res = await conn.getRepository(Firma).find()
        console.log(res)
    });

    //citanje Taksiste iz baze 
    let t1 = await conn.getRepository(Taksista).find();
    console.log('Procitani Taksista');
    console.log(t1[0]);

    //DODAVANJE TAKSISTE U FIRMU
    conn.getRepository(Firma).findOne({naziv: 'Bros'}).then(res => {
        let t2 = new Taksista('Milica', 'Martinovic', 'comi', '0000');
        console.log(res);
        t2.firma = res as Firma;
        conn.getRepository(Taksista).save(t2).then(res => console.log(res));
    });
    //brisanje taksiste
    conn.getRepository(Taksista).findOne({username:'comi'}).then(async res=>{
        if (res){
            await conn.getRepository(Taksista).remove(res);
            console.log('Taksista obrisan')
        }
        else {
            console.log('Ne postoji taksista !!!')
        }
    })

    //dodavanje voznje 
    let v= new Voznja('Trosarina','zeleznicka stanica',5,1,new Date());
    
    conn.getRepository(Taksista).findOne({ username: 'comi' }).then(async res=>{
        if(res)
        {
            v.Vozac=res as Taksista;
            conn.getRepository(Voznja).save(v);
        }
        else{
            console.log('Ne postoji taksista')
        }
    }
    );
   //citanje svih voznji iz baze
   conn.getRepository(Voznja).find().then(res=>console.log(res))
   
}).catch(error => console.log(error));
