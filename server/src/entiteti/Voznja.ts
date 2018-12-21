import { Taksista } from "./Taksista";
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('voznja')
export class Voznja {

    @PrimaryGeneratedColumn()
    id!:number

    @Column()
    lokacija_od:string

    @Column()
    lokacija_do:string

    @Column()
    ocena:number

    @Column()
    u_toku:number

    @Column()
    datum:Date;

    @ManyToOne(type=>Taksista, taxi=>taxi.lista_voznji,{ onDelete: 'CASCADE' })
    @JoinColumn({name:'id_taksiste'})
    vozac!:Taksista

    get Vozac(): Taksista {
        return this.vozac;
    }
    set Vozac(value: Taksista) {
        this.vozac = value;
    }

    constructor(
        lokacija_od:string,
        lokacija_do:string,
        ocena:number,
        u_toku:number,
        datum:Date
    ){
        this.lokacija_do=lokacija_do;
        this.lokacija_od=lokacija_od;
        this.ocena=ocena;
        this.u_toku=u_toku;
        this.datum=datum;
    }
}
