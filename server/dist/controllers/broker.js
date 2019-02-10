"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Voznja_1 = require("../entities/Voznja");
var typeorm_1 = require("typeorm");
var taxyDriver_repository_1 = require("../customRepositories/taxyDriver.repository");
var rideRepository_1 = require("../customRepositories/rideRepository");
var Broker = /** @class */ (function () {
    function Broker(connection) {
        this.conn = connection;
    }
    Broker.prototype.start = function () {
        this.receiveCords();
        this.receiveRequests();
        this.receiveResponse();
        this.receiveStartRide();
        //this.receiveOcena();
        this.receiveEndRide();
    };
    Broker.prototype.receiveCords = function () {
        var _this = this;
        this.conn.createChannel(function (err, ch) {
            ch.assertQueue("KoordinateTaksista");
            ch.consume("KoordinateTaksista", function (msg) {
                if (msg) {
                    _this.replyReceivingCorrds(msg.content.toString());
                }
            }, { noAck: true });
        })
            .cat;
    };
    Broker.prototype.replyReceivingCorrds = function (msg) {
        this.conn.createChannel(function (err, ch) {
            ch.assertExchange("amq.fanout", "fanout", { durable: true });
            ch.publish("amq.fanout", "", new Buffer(msg));
        });
    };
    Broker.prototype.receiveRequests = function () {
        var _this = this;
        this.conn.createChannel(function (err, ch) {
            ch.assertQueue("ZahtevQueue");
            ch.consume("ZahtevQueue", function (msg) {
                if (msg) {
                    _this.replyRequests(msg.content.toString());
                }
            }, { noAck: true });
        });
    };
    Broker.prototype.replyRequests = function (msg) {
        this.conn.createChannel(function (err, ch) {
            var request = JSON.parse(msg);
            var taxiUsername = request.usernameTaksiste;
            ch.assertQueue(taxiUsername + ":zahtev");
            ch.sendToQueue(taxiUsername + ":zahtev", new Buffer(msg));
        });
    };
    Broker.prototype.receiveResponse = function () {
        var _this = this;
        this.conn.createChannel(function (err, ch) {
            ch.assertQueue("OdgovorQueue");
            ch.consume("OdgovorQueue", function (msg) {
                if (msg) {
                    _this.replyResponse(msg.content.toString());
                }
            }, { noAck: true });
        });
    };
    Broker.prototype.replyResponse = function (msg) {
        this.conn.createChannel(function (err, ch) {
            var response = JSON.parse(msg);
            var queueForResponse = response.listeningQueue;
            ch.assertQueue(queueForResponse);
            ch.sendToQueue(queueForResponse, new Buffer(msg));
        });
    };
    Broker.prototype.receiveEndRide = function () {
        var _this = this;
        this.conn.createChannel(function (err, ch) {
            ch.assertQueue("KrajVoznjeQueue");
            ch.consume("KrajVoznjeQueue", function (msg) {
                if (msg) {
                    var endRide_1 = JSON.parse(msg.content.toString());
                    var taxiRepo = typeorm_1.getCustomRepository(taxyDriver_repository_1.TaxiDriverRepository);
                    taxiRepo.findDriverByUsername(endRide_1.username)
                        .then(function (vozac) {
                        var rideRepo = typeorm_1.getCustomRepository(rideRepository_1.RideRepository);
                        rideRepo.findDriverRide(vozac, 1)
                            .then(function (ride) {
                            ride.lokacija_do_lat = endRide_1.lat;
                            ride.lokacija_do_lon = endRide_1.lon;
                            ride.u_toku = 0;
                            rideRepo.save(ride)
                                .then(function (r) {
                                _this.replyEndRide(msg.content.toString(), r);
                            });
                        });
                    })
                        //let taksista_id:number = (taksista as Taksista).id;
                        .catch(function (err) { return console.log(err); });
                }
            }, { noAck: true });
        });
    };
    Broker.prototype.replyEndRide = function (msg, v) {
        this.conn.createChannel(function (err, ch) {
            var endRide = JSON.parse(msg);
            var voznja = { id_voznje: v.id };
            var queueForResponse = endRide.queueForResponse + "1";
            ch.assertQueue(queueForResponse);
            ch.sendToQueue(queueForResponse, new Buffer(JSON.stringify(voznja)));
        });
    };
    Broker.prototype.receiveStartRide = function () {
        this.conn.createChannel(function (err, ch) {
            ch.assertQueue("PocetakVoznjeQueue");
            ch.consume("PocetakVoznjeQueue", function (msg) {
                if (msg) {
                    var startRide = JSON.parse(msg.content.toString());
                    var voznja_1 = new Voznja_1.Voznja(startRide.lat_start, startRide.lon_start, "", "", -1, 1, new Date());
                    var taxiRepo = typeorm_1.getCustomRepository(taxyDriver_repository_1.TaxiDriverRepository);
                    taxiRepo.findDriverByUsername(startRide.username)
                        .then(function (vozac) {
                        if (vozac) {
                            voznja_1.Vozac = vozac;
                            var rideRepo = typeorm_1.getCustomRepository(rideRepository_1.RideRepository);
                            rideRepo.save(voznja_1);
                        }
                        else {
                            console.log("error upisivanja voznje");
                        }
                    });
                }
            }, { noAck: true });
        });
    };
    return Broker;
}());
exports.default = Broker;
//# sourceMappingURL=broker.js.map