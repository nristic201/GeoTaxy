import * as express from 'express';
import * as bodyParser from 'body-parser';
import { apiRoute } from './controllers/routes';
import AMQPService from './services/amqp';
import Broker from './controllers/broker';

class App {
    public app: express.Application;
    public port: any;
    public amqp_service = new AMQPService();
    public broker: Broker;
    public amqpService:AMQPService;
    constructor(port: any, ) {
        this.amqpService=new AMQPService();
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
            this.amqp_service.getAMQPConnection().then((conn:any)=>{
                this.broker=new Broker(conn);
                this.broker.start();
            });
        });
    }
}


export default App;
