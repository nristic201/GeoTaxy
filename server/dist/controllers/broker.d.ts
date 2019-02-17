import { Voznja } from "../entities/Voznja";
declare class Broker {
    private conn;
    constructor(connection: any);
    start(): void;
    receiveCords(): void;
    replyReceivingCorrds(msg: string): void;
    receiveRequests(): void;
    replyRequests(msg: string): void;
    receiveResponse(): void;
    replyResponse(msg: string): void;
    receiveEndRide(): void;
    replyEndRide(msg: string, v: Voznja): void;
    receiveStartRide(): void;
}
export default Broker;
