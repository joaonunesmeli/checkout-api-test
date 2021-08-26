
function handleClientRegistration(req, res, deps) {
    const { mercadopago } = deps;
    const { email } = req.body;

    mercadopago
        .customers
        .create({ email })
        .then(response => {
            console.log(">>", response);
            res.status(response.status).json({ id: response.id });
        });
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
            res.status(response.status).json({ id: response.id });
        });
}

function getClient(req, res, deps) {
    const { mercadopago } = deps;
    const id = req.query("client_d");
    const searchParams = { qs: { id } };

    mercadopago
        .customers
        .search(searchParams)
        .then(response => res.status(response.status).json(response));
}

module.exports = {
    handleCardRegistration,
    handleClientRegistration,
}

