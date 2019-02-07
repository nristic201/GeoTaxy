import "reflect-metadata";
import express from "express";
import { createConnection, getManager, getCustomRepository } from "typeorm";
import { amqp_url } from './helpers'
import { Taksista } from "./entiteti/Taksista";

let app = express();
app.use("/", (req,res) => {
  let obj = req.body.driver;
  createConnection().then(async conn => {
    let t1 = await conn.getRepository(Taksista).find({
      username: obj.username
    });
    if (t1[0].password === obj.username) {
      res.json(t1);
    } else {
      res.json({
        error: "wrong data"
      });
    }
  });
});
app.listen(3000, () => {
  console.log("express pokrenut...");
  require("amqplib/callback_api").connect(
    amqp_url,
    (err: any, conn: any) => {
      if (err) bail(err);
      console.log('amqp pokrenut...')
    }
  );
});

const db = require("../src/modules/ormconfig");

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
        replyReceivingCorrds(conn, msg.content.toString());
      }
    });
  });
}
function replyReceivingCorrds(conn: any, msg: string) {
  conn.createChannel((err: any, ch: any) => {
    if (!err == null) bail(err);
    ch.assertExchange("amq.fanout", "fanout", { durable: true });
    ch.publish("amq.fanout", "", new Buffer(msg));
  });
}
const queueExist = (conn: any) => {};

process.on('uncaughtException', function (err) {
  console.error(err);
 });
