import { Voznja } from "../entities/Voznja";
import { Taksista } from "../entities/Taksista";
import { getCustomRepository } from "typeorm";
import { TaxiDriverRepository } from "../customRepositories/taxyDriver.repository";
import { RideRepository } from "../customRepositories/rideRepository";

class Broker {
    private conn: any;
    constructor(connection: any) {
        this.conn = connection;
    }

    start() {
        this.receiveCords();
        this.receiveRequests();
        this.receiveResponse();
        this.receiveStartRide();
        this.receiveOcena();
        this.receiveEndRide();
    }
    receiveCords() {
        this.conn.createChannel((err: any, ch: any) => {
            ch.assertQueue("KoordinateTaksista");
            ch.consume(
                "KoordinateTaksista",
                (msg: any) => {
                    if (msg) {
                        this.replyReceivingCorrds(msg.content.toString());
                    }
                },
                { noAck: true }
            )
        })
            .cat
    }

    replyReceivingCorrds(msg: string) {
        this.conn.createChannel((err: any, ch: any) => {
            ch.assertExchange("amq.fanout", "fanout", { durable: true });
            ch.publish("amq.fanout", "", new Buffer(msg));
        });
    }

    receiveRequests() {
        this.conn.createChannel((err: any, ch: any) => {
            ch.assertQueue("ZahtevQueue");
            ch.consume(
                "ZahtevQueue",
                (msg: any) => {
                    if (msg) {
                        this.replyRequests(msg.content.toString());
                    }
                },
                { noAck: true }
            );
        });
    }

    replyRequests(msg: string) {
        this.conn.createChannel((err: any, ch: any) => {
            let request = JSON.parse(msg);
            let taxiUsername = request.usernameTaksiste;
            ch.assertQueue(taxiUsername + ":zahtev");
            ch.sendToQueue(taxiUsername + ":zahtev", new Buffer(msg));
        });
    }


    receiveResponse() {
        this.conn.createChannel((err: any, ch: any) => {
            ch.assertQueue("OdgovorQueue");
            ch.consume(
                "OdgovorQueue",
                (msg: any) => {
                    if (msg) {
                        this.replyResponse(msg.content.toString());
                    }
                },
                { noAck: true }
            );
        });
    }

    replyResponse(msg: string) {
        this.conn.createChannel((err: any, ch: any) => {
            let response = JSON.parse(msg);
            let queueForResponse = response.listeningQueue;
            ch.assertQueue(queueForResponse);
            ch.sendToQueue(queueForResponse, new Buffer(msg));
        });
    }

    receiveEndRide() {
        this.conn.createChannel((err: any, ch: any) => {
            ch.assertQueue("KrajVoznjeQueue");
            ch.consume(
                "KrajVoznjeQueue",
                (msg: any) => {
                    if (msg) {
                        let endRide = JSON.parse(msg.content.toString());
                        let taxiRepo = getCustomRepository(TaxiDriverRepository);
                        taxiRepo.findDriverByUsername(endRide.username)
                            .then((vozac: Taksista) => {
                                let rideRepo = getCustomRepository(RideRepository);
                                rideRepo.findDriverRide(vozac, 1)
                                    .then((ride: Voznja) => {
                                        ride.lokacija_do_lat = endRide.lat;
                                        ride.lokacija_do_lon = endRide.lon;
                                        ride.u_toku = 0;
                                        rideRepo.save(ride)
                                            .then((r: Voznja) => {
                                                this.replyEndRide(msg.content.toString(), r);
                                            });
                                    })
                            })
                            //let taksista_id:number = (taksista as Taksista).id;
                            .catch((err: any) => console.log(err));
                    }
                },
                { noAck: true }
            );
        });
    }
    replyEndRide(msg: string, v: Voznja) {
        this.conn.createChannel((err: any, ch: any) => {
            let endRide = JSON.parse(msg);
            let voznja = { id_voznje: v.id };
            let queueForResponse = endRide.queueForResponse + "1";

            ch.assertQueue(queueForResponse);
            ch.sendToQueue(queueForResponse, new Buffer(JSON.stringify(voznja)));
        });
    }
    receiveStartRide() {
        this.conn.createChannel((err: any, ch: any) => {
            ch.assertQueue("PocetakVoznjeQueue");
            ch.consume(
                "PocetakVoznjeQueue",
                (msg: any) => {
                    if (msg) {
                        let startRide = JSON.parse(msg.content.toString());
                        let voznja = new Voznja(
                            startRide.lat_start,
                            startRide.lon_start,
                            "",
                            "",
                            -1,
                            1,
                            new Date()
                        );

                        let taxiRepo = getCustomRepository(TaxiDriverRepository);
                        taxiRepo.findDriverByUsername(startRide.username)
                            .then((vozac: Taksista) => {
                                if (vozac) {
                                    voznja.Vozac = vozac;
                                    let rideRepo = getCustomRepository(RideRepository);
                                    rideRepo.save(voznja);
                                } else {
                                    console.log("error upisivanja voznje");
                                }
                            });
                    }
                },
                { noAck: true }
            );
        });
    }
    receiveOcena() {
        this.conn.createChannel((err: any, ch: any) => {
            ch.assertQueue("OcenaQueue");
            ch.consume(
                "OcenaQueue",
                (msg: any) => {
                    if (msg) {
                        let rideRepo = getCustomRepository(RideRepository);
                        let ocena = JSON.parse(msg.content.toString());
                        rideRepo.findRideByID(ocena.id)
                            .then((res: any) => {
                                let voznja = res as Voznja;
                                voznja.ocena = ocena.ocena;
                                rideRepo.save(voznja);
                            });
                    }
                },
                { noAck: true }
            );
        });
    }
}

export default Broker;