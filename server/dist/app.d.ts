import * as express from 'express';
import AMQPService from './services/amqp';
import Broker from './controllers/broker';
declare class App {
    app: express.Application;
    port: any;
    amqp_service: AMQPService;
    broker: Broker;
    amqpService: AMQPService;
    constructor(port: any);
    private config;
}
export default App;
