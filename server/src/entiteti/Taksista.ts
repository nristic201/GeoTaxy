import { Firma } from "./Firma";
import { Voznja } from "./Voznja";
import { Entity, Column, ManyToOne, OneToMany, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('taksista')
export class Taksista {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    ime: string;
    get Ime(): string {
        return this.ime;
    }
    set Ime(value: string) {
        this.ime = value;
    }

    @Column()
    prezime: string;
    get Prezime(): string {
        return this.prezime;
    }
    set Prezime(value: string) {
        this.prezime = value;
    }

    @Column()
    username: string 
    get Username(): string {
        return this.username;
    }
    set Username(value: string) {
        this.username = value;
    }

    @Column()
    password: string
    get Password(): string {
        return this.password;
    }
    set Password(value: string) {
        this.password = value;
    }

    @ManyToOne(type => Firma, firma => firma.lista_vozaca,{ onDelete: 'CASCADE'})
    @JoinColumn({ name: "id_firme" })
    firma!: Firma;

    @Column()
    ocena: number
    get Ocena(): number {
        return this.ocena;
    }
    set Ocena(value: number) {
        this.ocena = value;
    }


    @OneToMany(type => Voznja, voznja => voznja.vozac)
    lista_voznji!: Voznja[]

    constructor (
        ime:string,
        prezime:string,
        username:string,
        password:string,
        ocena:number
    ){
        this.ime=ime;
        this.prezime=prezime;
        this.username=username;
        this.password=password;
        this.ocena = ocena;
    }
}