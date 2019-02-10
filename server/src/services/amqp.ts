import { amqp_url } from "../helpers/amqp";


class AMQPService {
    private connection: any;
    private amqp: any;
    constructor() {
        this.amqp = require("amqplib");
    }
    async getAMQPConnection():Promise<any> {
        if (this.connection) {
            console.log('tried');
            return this.connection;
        }
        this.connection = await this.amqp.connect(amqp_url);
        console.log('amqp pokrenut ...')
        return this.connection;
    }
}

export default AMQPService;