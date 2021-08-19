const express = require("express");
const mercadopago = require("mercadopago");

mercadopago.configurations.setAccessToken("TEST-4462057603423196-081818-538db50811c9494fa1393f688b03b36d-809883123");

function processPayment(req, res) {
    console.log("process payment ->", req.body);

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
            console.log("process payment | mercado pago response ->", response.body)
            res.status(response.status).json({
                status: response.body.status,
                status_detail: response.body.status_detail,
                id: response.body.id
            });
        }).catch(function(error) {
            console.log("process payment error:", error)
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
app.post("/process_card_payment", processPayment);

app.listen(8081, () => {
  console.log("The server is now running on Port 8081");
});

