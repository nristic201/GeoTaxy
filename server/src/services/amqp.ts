import { amqp_url } from "../helpers/amqp";


class AMQPService {
    private connection: any;
    private amqp: any;
    constructor() {
        this.amqp = require("amqplib/callback_api");
    }
    async getAMQPConnection() {
        return new Promise((resolve, reject) => {
            if (this.connection) {
               // reject()
                //console.log('tried');
                //return this.connection;
            }
            else{
                this.amqp.connect(amqp_url, (err:any, conn:any) => {
                    resolve(conn);
                })
               // this.amqp.connect(amqp_url, (err:any, conn:any) => {
                    
               //     return conn;
                //});
            }
        })
        
        
    }
}

export default AMQPService;