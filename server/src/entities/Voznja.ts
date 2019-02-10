import { Taksista } from "./Taksista";
import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('voznja')
export class Voznja {

    @PrimaryGeneratedColumn()
    id!:number;

    @Column()
    lokacija_od_lat:string;
    
    @Column()
    lokacija_od_lon:string;

    @Column()
    lokacija_do_lat:string;

    @Column()
    lokacija_do_lon:string

    @Column()
    ocena:number;

    @Column()
    u_toku:number;

    @Column()
    datum:Date;

    @ManyToOne(type=>Taksista, taxi=>taxi.lista_voznji,{ onDelete: 'CASCADE' })
    @JoinColumn({name:'id_taksiste'})
    vozac!:Taksista;

    get Vozac(): Taksista {
        return this.vozac;
    }
    set Vozac(value: Taksista) {
        this.vozac = value;
    }

    constructor(
        lokacija_od_lat:string,
        lokacija_od_lon:string,
        lokacija_do_lat:string,
        lokacija_do_lon:string,
        ocena:number,
        u_toku:number,
        datum:Date
    ){
        this.lokacija_do_lat=lokacija_do_lat;
        this.lokacija_do_lon=lokacija_do_lon;
        this.lokacija_od_lat=lokacija_od_lat;
        this.lokacija_od_lon=lokacija_od_lon;
        this.ocena=ocena;
        this.u_toku=u_toku;
        this.datum=datum;
    }
}
