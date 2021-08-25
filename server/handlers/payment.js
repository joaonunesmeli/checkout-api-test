function handleCardPayment(req, res, deps) {
    const { mercadopago } = deps;
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

function handlePayment(req, res, deps) {
    const { mercadopago } = deps;
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

module.exports = {
    handleCardPayment,
    handlePayment,
}

