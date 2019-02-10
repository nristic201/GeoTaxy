
import { createConnection, Connection } from "typeorm";
import { Taksista } from "../entities/Taksista";
import { Firma } from "../entities/Firma";
import { Voznja } from "../entities/Voznja";
class DBService {
  private connection: Connection;

  constructor() {
  }
  async getConnection(): Promise<Connection> {
    if (this.connection) {
      console.log('tried');
      return this.connection;
    } this.connection = await createConnection({
      type: "mysql",
      host: "aips.czbjdoxncuy5.us-east-2.rds.amazonaws.com",
      port: 3306,
      username: "r1sta",
      database: "db_aips",
      password: "7sims000",
      logging: false,
      entities: [
        Taksista, Firma, Voznja
      ]
    });
    console.log('konekcija sa bazom ...')
    return this.connection;
  }
}

export default DBService;