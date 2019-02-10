import App from './app'

const port = process.env.PORT || 3000;

new App(port);
process.on("uncaughtException", function(err) {
  console.error(err);
});

