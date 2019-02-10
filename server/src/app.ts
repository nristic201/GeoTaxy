import * as express from 'express';
import * as bodyParser from 'body-parser';
import { apiRoute } from './controllers/routes';
import DBService from './services/db.service';

class App {
    public app: express.Application;
    public port: any;
    public db_service= new DBService()

    constructor(
        port: any,
    ) {
        
        this.app = express();
        this.port = port;
        this.config();

    }
    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(apiRoute);
        this.app.listen(this.port, () => {
            console.log("express pokrenut... port 3k");
        });
    }
}


export default App;
