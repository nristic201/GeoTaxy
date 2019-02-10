import { Connection } from "typeorm";
declare class DBService {
    private connection;
    constructor();
    getConnection(): Promise<Connection>;
}
export default DBService;
