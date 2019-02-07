import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Taksista } from "./Taksista";


@Entity('firma')
export class Firma {
  
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column({ type: 'varchar' })
  naziv: string;

  @Column({ type: 'varchar' })
  sediste: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  telefon: string;

  @OneToMany(type => Taksista, taxi => taxi.firma)
  lista_vozaca!: Taksista[]

  get Lista_vozaca(): Taksista[] {
    return this.lista_vozaca;
  }
  set Lista_vozaca(value: Taksista[]) {
    this.lista_vozaca = value;
  }

  constructor(
    // id: number,
    naziv: string,
    sediste: string,
    email: string,
    telefon: string,
  ) {
    // this.id = id;
    this.naziv = naziv;
    this.sediste = naziv;
    this.email = email;
    this.telefon = telefon;
  }
}
