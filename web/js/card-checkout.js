const mp = new MercadoPago('TEST-bd45953c-87c2-4a23-991e-c4584a8bd3f1');

const cardForm = mp.cardForm({
  amount: "100.00",
  autoMount: true,
  form: {
    id: "form-checkout",
    cardholderName: {
      id: "card-checkout-cardholderName",
      placeholder: "Titular do cartão",
    },
    cardholderEmail: {
      id: "card-checkout-cardholderEmail",
      placeholder: "E-mail",
    },
    cardNumber: {
      id: "card-checkout-cardNumber",
      placeholder: "Número do cartão",
    },
    cardExpirationMonth: {
      id: "card-checkout-cardExpirationMonth",
      placeholder: "Mês de vencimento",
    },
    cardExpirationYear: {
      id: "card-checkout-cardExpirationYear",
      placeholder: "Ano de vencimento",
    },
    securityCode: {
      id: "card-checkout-securityCode",
      placeholder: "Código de segurança",
    },
    installments: {
      id: "card-checkout-installments",
      placeholder: "Parcelas",
    },
    identificationType: {
      id: "card-checkout-identificationType",
      placeholder: "Tipo de documento",
    },
    identificationNumber: {
      id: "card-checkout-identificationNumber",
      placeholder: "Número do documento",
    },
    issuer: {
      id: "card-checkout-issuer",
      placeholder: "Banco emissor",
    },
  },
  callbacks: {
    onFormMounted: error => {
      if (error) return console.warn("Form Mounted handling error: ", error);
      console.log("Form mounted");
    },
    onSubmit: event => {
      event.preventDefault();

      const {
        paymentMethodId: payment_method_id,
        issuerId: issuer_id,
        cardholderEmail: email,
        amount,
        token,
        installments,
        identificationNumber,
        identificationType,
      } = cardForm.getCardFormData();

      fetch("/process_payment", {
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
    },
    onFetching: (resource) => {
      console.log("Fetching resource: ", resource);

      // Animate progress bar
      const progressBar = document.querySelector(".progress-bar");
      progressBar.removeAttribute("value");

      return () => {
        progressBar.setAttribute("value", "0");
      };
    },
  },
});

