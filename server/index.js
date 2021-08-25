const express = require("express");
const mercadopago = require("mercadopago");

mercadopago.configurations.setAccessToken("TEST-3956725732885226-082317-be090641f90300d8755287af4b98c871-812341708");

function processCardPayment(req, res) {
    console.log("process card payment ->", req.body);

    const data = {
        transaction_amount: Number(req.body.transaction_amount),
        token: req.body.token,
        description: req.body.description,
        installments: Number(req.body.installments),
        payment_method_id: req.body.payment_method_id,
        issuer_id: req.body.issuer,
        payer: {
            email: req.body.payer.email,
            identification: {
                type: req.body.doc_type,
                number: req.body.doc_number
            }
        }
    };

    mercadopago.payment.save(data)
        .then(function(response) {
            console.log("process card payment | mercado pago response ->", response.body)
            res.status(response.status).json(response);
        }).catch(function(error) {
            console.log("process card payment error:", error)
            res.status(res.status).send(error);
        });
}

function processPayment(req, res) {
    console.log("process boleto payment ->", req.body);

    const b = req.body;
    const data = {
        description: "Banana Radioativa",
        payment_method_id: req.body.paymentMethod,
        transaction_amount: Number(req.body.checkoutValue),
        payer: {
            email: b.email,
            first_name: b.firstName,
            last_name: b.lastName,
            identification: {
                type: 'CPF',
                number: b.cpf,
            },
            address:  {
                zip_code: "76843970",
                street_name: "MySQL Street",
                street_number: "3306",
                neighborhood: "RDBMS",
                city: "Databaseville",
                federal_unit: "RO",
            }
        }
    };

    mercadopago.payment.create(data)
        .then(function(response) {
            console.log("process boleto payment | mercado pago response ->", response.body)
            res.status(response.status).json(response);
        }).catch(function(error) {
            console.log("process boleto payment error:", error)
            res.status(res.status).send(error);
        });
}

function renderIndex(req, res) {
    res.status(200).sendFile("index.html");
}

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("../web"));

app.get("/", renderIndex);
app.post("/process_payment", processPayment);
app.post("/process_card_payment", processCardPayment);

app.listen(8081, () => {
  console.log("The server is now running on Port 8081");
});

