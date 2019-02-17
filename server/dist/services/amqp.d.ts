declare class AMQPService {
    private connection;
    private amqp;
    constructor();
    getAMQPConnection(): Promise<any>;
}
export default AMQPService;
