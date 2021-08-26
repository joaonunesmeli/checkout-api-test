const express = require("express");
const mercadopago = require("mercadopago");

const fakedb = require("./fakedb");
const { handleIndexRendering } = require("./handlers/view");
const { handlePayment, handleCardPayment } = require("./handlers/payment");
const {
    handleClientRegistration,
    handleCardRegistration
    getClient,
} = require("./handlers/client");

mercadopago.configurations.setAccessToken("TEST-3956725732885226-082317-be090641f90300d8755287af4b98c871-812341708");

function adapt(handler) {
    const deps = { mercadopago, fakedb };
    return (req, res) => handler(req, res, deps);
}

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("../web"));

app.get("/", handleIndexRendering);

app.post("/api/process_payment", adapt(handlePayment));
app.post("/api/process_card_payment", adapt(handleCardPayment));

app.get("/api/clients", adapt(getClient));
app.post("/api/clients", adapt(handleClientRegistration));
app.post("/api/clients/cards", adapt(handleCardRegistration));

app.listen(8081, () => {
  console.log("The server is now running on Port 8081");
});

