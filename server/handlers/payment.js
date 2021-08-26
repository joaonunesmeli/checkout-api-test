function extract({ response }) {
    return {
        id: response.id,
        createdAt: response.date_created,
        expirationDate: response.date_of_expiration,
        issuer: response.issuer_id,
        paymentMethodId: response.payment_method_id,
        paymentTypeId: response.payment_type_id,
        status: response.status,
        payer: response.payer,
        value: response.transaction_amount,
        barCode: response.barcode ? response.barcode : null,
        installments: response.installments,
        idempotency: response.idempotency,
        card: response.card ? response.card : null,
    };
}

function handleCardPayment(req, res, deps) {
    const { mercadopago, fakedb } = deps;

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
            const obj = extract(response);
            const { id } = obj;
            fakedb.set(`PAYMENT#${id}`, obj)
            res.status(201).json(obj);
        }).catch(function(error) {
            console.log("");
            console.log("");
            console.log("error ::", error);
            console.log("");
            console.log("");
            res.status(response.status).send(error);
        });
}

function handlePayment(req, res, deps) {
    const { mercadopago, fakedb } = deps;

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
            const obj = extract(response);
            const { id } = obj;
            fakedb.set(`PAYMENT#${id}`, obj)
            res.status(201).json(obj);
        }).catch(function(error) {
            console.log("");
            console.log("");
            console.log("error ::", error);
            console.log("");
            console.log("");
            res.status(response.status).send(error);
        });
}

module.exports = {
    handleCardPayment,
    handlePayment,
}

