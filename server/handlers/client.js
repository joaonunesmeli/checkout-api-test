function catchError(res) {
    return error => {
        console.log("");
        console.log("");
        console.log("error ::", error);
        console.log("");
        console.log("");
        res.status(response.status).send(error);
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
            res.status(response.status).json({ id })
        }).catch(catchError(res));
}

function handleCardRegistration(req, res, deps) {
    const { mercadopago } = deps;
    const {
        payment_method_id,
        customer_id,
        issuer_id,
        token,
    } = req.body;

    mercadopago
        .cards
        .create({
            customer: customer_id,
            payment_method_id,
            issuer_id,
            token,
        }).then(response => {
            console.log(">>", response);
            res.status(response.status).json({ id: response.id })
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

