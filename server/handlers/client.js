function catchError(res) {
    return error => {
        console.log("");
        console.log("");
        console.log("error ::", error);
        console.log("");
        console.log("");
        res.status(error.status).send(error);
    }
}

function handleClientRegistration(req, res, deps) {
    const { mercadopago, fakedb } = deps;
    const { email } = req.body;

    mercadopago
        .customers
        .create({ email })
        .then(r => {
            const { id, email } = r.response;
            const k = `CLIENT#${id}`;
            const v = {
                email: email,
                id: id,
            };
            fakedb.set(k, v);
            res.status(r.status).json({ id })
        }).catch(catchError(res));
}

function handleCardRegistration(req, res, deps) {
    const { mercadopago, fakedb } = deps;
    const {
        payment_method_id,
        customer_id,
        issuer_id,
        token,
    } = req.body;

    mercadopago
        .card
        .create({
            issuer_id: Number(issuer_id),
            payment_method_id,
            customer_id,
            token,
        }).then(r => {
            const {
                id,
                expiration_month,
                first_six_digits,
                last_four_digits,
                expiration_year,
                security_code,
                customer_id,
                issuer,
            } = r.response;

            const k = `CARD#${id}`;
            const v = {
                expirationMonth: expiration_month,
                firstSixDigits: first_six_digits,
                lastFourDigits: last_four_digits,
                expirationYear: expiration_year,
                securityCode: security_code,
                customerId: customer_id,
                issuer,
                id,
            };

            fakedb.set(k, v);
            res.status(r.status).json({ id })
        }).catch(catchError(res));
}

function getClient(req, res, deps) {
    const { mercadopago } = deps;
    const id = req.query("client_d");
    const searchParams = { qs: { id } };

    mercadopago
        .customers
        .search(searchParams)
        .then(response => res.status(response.status).json(response))
        .catch(catchError(res))
}

module.exports = {
    handleClientRegistration,
    handleCardRegistration,
    getClient,
}

