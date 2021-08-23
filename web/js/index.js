const paymentTypes = [
    "card",
    "ticket",
    "pix",
]

const paymentSectionDisplays = {};

function getPaymentTypeSectionElement(t) {
    if (t === "card") {
        return document.getElementById(`${t}-checkout-section`);
    }
    return document.getElementById("ticket-checkout-section");
}

function setTicketDocType(t) {
    const e = document.getElementById("docType");
    const titleElem = document.getElementById("ticket-title");
    if (t === "pix") {
        titleElem.innerText = "Pix";
        e.placeholder = "Pix";
        e.value = "pix";
    } else {
        titleElem.innerText = "Boleto";
        e.placeholder = "Boleto";
        e.value = "bolbradesco";
    }
}

function hide(element) {
    element.style.display = "none";
}

function show(type, element) {
    element.style.display = paymentSectionDisplays[type];
}

function setPaymentType(paymentType) {
    setTicketDocType(paymentType);

    for (let i = 0; i < paymentTypes.length; i++) {
        const t = paymentTypes[i];
        const e = getPaymentTypeSectionElement(t);
        hide(e);
    }

    const e = getPaymentTypeSectionElement(paymentType);
    show(paymentType, e);
}

function initPaymentTypeSections() {
    for (let i = 0; i < paymentTypes.length; i++) {
        const t = paymentTypes[i];
        const e = getPaymentTypeSectionElement(t);
        paymentSectionDisplays[t] = "block";
        hide(e);
    }
}

initPaymentTypeSections();
