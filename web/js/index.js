const paymentTypes = [
    "card",
    "ticket",
    "pix",
]

const paymentSectionDisplays = {};

function getPaymentTypeSectionElement(t) {
    const id = `${t}-checkout-section`;
    return document.getElementById(id);
}

function hide(element) {
    element.style.display = "none";
}

function show(type, element) {
    element.style.display = paymentSectionDisplays[type];
}

function setPaymentType(paymentType) {
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
        paymentSectionDisplays[t] = e.style.display || "block";
        hide(e);
    }
}

initPaymentTypeSections();
