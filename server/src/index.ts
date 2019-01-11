import "reflect-metadata";
import express from "express";
import { createConnection, getManager, getCustomRepository, Any } from "typeorm";
import { amqp_url } from "../helpers";
import { Taksista } from "./entiteti/Taksista";
import { Voznja } from "./entiteti/Voznja";

let app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());

const db = require("../src/modules/ormconfig");

createConnection(db).then(conn => {
  app.post("/login", (req, res) => {

    console.log(req.body);
    let username = req.body.username;
    let password = req.body.password;

    let t1 = conn.getRepository(Taksista).find({
      username: username
    }).then(user => {

      console.log(user[0]);
      if (user[0].password === password) {
        res.json(user[0]);
      } else {
        res.json({
          error: "wrong data"
        });
      }
    });
  })

  app.listen(3000, () => {
    console.log("express pokrenut...");
    let amqp = require("amqplib/callback_api");
    amqp.connect(
      amqp_url,
      (err: any, conn: any) => {
        if (err) bail(err);
        console.log('amqp pokrenut...');

        receiveCoords(conn);
        receiveRequests(conn);
        receiveResponse(conn);
        receiveOcena(conn);
        receiveEndRide(conn);
      }
    );

  });
}).catch(err => console.log(err));


function bail(err: any) {
  console.error(err);
  process.exit(1);
}

function receiveCoords(conn: any) {
  conn.createChannel((err: any, ch: any) => {
    if (!err == null) bail(err);
    ch.assertQueue("KoordinateTaksista");
    ch.consume("KoordinateTaksista", (msg: any) => {
      if (msg) {
        console.log(msg);
        replyReceivingCorrds(conn, msg.content.toString());
      }
    });
  });
}

function replyReceivingCorrds(conn: any, msg: string) {
  conn.createChannel((err: any, ch: any) => {
    if (!err == null) bail(err);
    console.log(msg, "2");
    ch.assertExchange("amq.fanout", "fanout", { durable: true });
    ch.publish("amq.fanout", "", new Buffer(msg));
  });
}

function receiveRequests(conn: any) {
  conn.createChannel((err: any, ch: any) => {
    if (!err == null) bail(err);
    ch.assertQueue("ZahtevQueue");
    ch.consume("ZahtevQueue", (msg: any) => {
      if (msg) {
        replyRequests(conn, msg.content.toString());
      }
    });
  });
}

function replyRequests(conn: any, msg: string) {
  conn.createChannel((err: any, ch: any) => {
    if (!err == null) bail(err);
    let request = JSON.parse(msg);
    let taxiUsername = request.usernameTaksiste;
    ch.assertQueue(taxiUsername + ":zahtev");
    ch.sendToQueue(taxiUsername + ":zahtev", new Buffer(msg));
  });
}

function receiveResponse(conn: any) {
  conn.createChannel((err: any, ch: any) => {

    if (!err == null) bail(err);

    ch.assertQueue("OdgovorQueue");
    ch.consume("OdgovorQueue", (msg: any) => {
      if (msg) {
        console.log(msg);
        replyResponse(conn, msg.content.toString());
      }
    });
  });
}

function replyResponse(conn: any, msg: string) {
  conn.createChannel((err: any, ch: any) => {
    if (!err == null) bail(err);
    let response = JSON.parse(msg);
    let queueForResponse = response.listeningQueue;
    ch.assertQueue(queueForResponse);
    ch.sendToQueue(queueForResponse, new Buffer(msg));
  });
}

function receiveEndRide(conn:any) {
  conn.createChannel((err: any, ch: any) => {

    if (!err == null) bail(err);

    ch.assertQueue("KrajVoznjeQueue");
    ch.consume("KrajVoznjeQueue", (msg: any) => {
      if (msg) {
        replyEndRide(conn, msg.content.toString());
      }
    });
  }); 
}

function replyEndRide(conn: any, msg: string) {
  conn.createChannel((err: any, ch: any) => {
    if (!err == null) bail(err);
    let endRide = JSON.parse(msg);
    let queueForResponse = endRide.queueForResponse + "1";
    ch.assertQueue(queueForResponse);
    ch.sendToQueue(queueForResponse, new Buffer(msg));
  });
}

function receiveOcena(conn: any) {

  conn.createChannel((err: any, ch: any) => {

    if (!err == null) bail(err);

    ch.assertQueue("OcenaQueue");
    ch.consume("OcenaQueue", (msg: any) => {
      if (msg) {
       //upisi u bazu
      }
    });
  });
}
const queueExist = (conn: any) => { };
