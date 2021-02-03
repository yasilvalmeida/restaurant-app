import App from "./app";
import Environment from "./environment";

const envParameters = new Environment("test");
const myApp = new App(envParameters);
const PORT = envParameters.getPort();
const ENV = envParameters.getEnv();
const toobusy = require("toobusy-js");

const server = myApp.app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}, ${ENV} environment`);
});

process.on("SIGINT", () => {
  server.close();
  // calling .shutdown allows your process to exit normally
  toobusy.shutdown();
  process.exit();
});
