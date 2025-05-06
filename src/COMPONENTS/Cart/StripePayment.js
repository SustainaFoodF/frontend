import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { payCommand } from "../../services/commandeService";

const stripePromise = loadStripe(
  "pk_test_51RAuHU2LYJb902nCi48KXCy7G44z42ttC3x4AAW9wYmEBfS0tfCQkT4z5H0MGxcjnHYHmuWDJsm3CHUkGMygFIJd004vmvRjcI"
); // Replace with your public key

const CheckoutForm = ({ setactive, commandId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // No return_url needed if not using redirects
      },
      redirect: "if_required", // ← this is key
    });
    if (error) {
      setMessage(error.message);
    }
    if (paymentIntent?.status === "succeeded") {
      await payCommand(commandId);
      setactive(4);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />

      <div className="btns">
        <button
          className="backbtn"
          onClick={() => {
            setactive(2);
          }}
        >
          Back
        </button>
        <button className="nextbtn" type="submit" disabled={!stripe}>
          Next
        </button>
      </div>
      {message && <div>{message}</div>}
    </form>
  );
};

const StripePayment = ({ commandId, setactive }) => {
  const [clientSecret, setClientSecret] = useState("");
  const sendPaymentToBackend = () => {
    fetch("http://localhost:5001/payment/create-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commandId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setIsRequestSended(true);
      });
  };
  const [isRequestSended, setIsRequestSended] = useState(false);

  useEffect(() => {
    if (!isRequestSended && commandId != null) {
      sendPaymentToBackend();
    }
  }, [isRequestSended, commandId]);

  const appearance = {
    theme: "stripe",
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="paymentcont">
      <h2 className="mainhead1">Stripe Payment</h2>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm setactive={setactive} commandId={commandId} />
        </Elements>
      )}
    </div>
  );
};

export default StripePayment;
