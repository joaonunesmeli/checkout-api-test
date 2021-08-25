const mp = new MercadoPago("TEST-651cca06-63aa-458d-86c0-94eb2a0a3f7c");

/**
 *
 * =============================================================================
 *
 * DOM
 *
 * =============================================================================
 *
 */

function node(id) {
    return document.getElementById(id);
}

function hide(element) {
    element.style.display = "none";
}

function show(element) {
    element.style.display = "block";
}

function onSelectPaymentMethod(event) {
    const paymentMethod = event.target.value;
    const n = node("checkout-form");
    const m = node("card-checkout-form");
    if (paymentMethod === "cardToken") {
        show(m);
        hide(n);
    } else {
        node("checkout-payment-method").value = paymentMethod;
        show(n);
        hide(m);
    }
}

/**
 *
 * =============================================================================
 *
 * Card form
 *
 * =============================================================================
 *
 */

function formField(field, nodeID, placeholder) {
    return {
        [field]: {
            id: nodeID,
            placeholder,
        }
    };
}

function formFields(id, fields) {
    const f = { id };
    const mfn = args => formField.apply(null, args);
    const rfn = (acc, field) => ({ ...acc, ...field });
    return fields.map(mfn).reduce(rfn, f);
}

function formStructure(id) {
    const fields = [
        ["cardholderName", "card-holder-name", "Titular do cartão"],
        ["cardholderEmail", "card-holder-email", "E-mail"],
        ["cardNumber", "card-number", "Número do cartão"],
        ["cardExpirationMonth", "card-expiration-month", "Mês de vencimento"],
        ["cardExpirationYear", "card-expiration-year", "Ano de vencimento"],
        ["securityCode", "card-security-code", "Código de segurança"],
        ["installments", "card-installments", "Parcelas"],
        ["identificationType", "card-identification-type", "Tipo de documento"],
        ["identificationNumber", "card-identification-number", "Número do documento"],
        ["issuer", "card-issuer", "Banco emissor"],
    ];
    return formFields(id, fields);
}

function onFormMounted(error) {
    if (error) {
        console.warn("Form mounted handling error:", error);
    } else {
        console.log("Form mounted");
    }
}

function onFetching(resource) {
    console.log("Fetching resource:", resource);

    const progress = document.querySelector(".progress-bar");
    progress.removeAttribute("value");

    return () => {
        progress.setAttribute("value", "0");
    }
}

/**
 *
 * =============================================================================
 *
 * Init
 *
 * =============================================================================
 *
 */

function init() {
    const cardForm = mp.cardForm({
        autoMount: true,
        amount: "100.00",
        form: formStructure("card-checkout-form"),
        callbacks: {
            onFetching,
            onFormMounted,
            onSubmit: event => {
                event.preventDefault();

                const {
                    token,
                    amount,
                    installments,
                    identificationType,
                    issuerId: issuer_id,
                    identificationNumber,
                    cardholderEmail: email,
                    paymentMethodId: payment_method_id,
                } = cardForm.getCardFormData();

                fetch("/process_card_payment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token,
                        issuer_id,
                        payment_method_id,
                        transaction_amount: Number(amount),
                        installments: Number(installments),
                        description: "Descrição do produto",
                        payer: {
                            email,
                            identification: {
                                type: identificationType,
                                number: identificationNumber,
                            },
                        },
                    }),
                });
            }
        },
    });

    hide(node("card-checkout-form"));

    node("payment-method").onchange = onSelectPaymentMethod;
}

init();

