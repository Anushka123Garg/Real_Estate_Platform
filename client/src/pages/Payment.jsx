import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

const PaymentForm = ({ amount, listingId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Send payment method and listing details to the backend for further processing
    const res = await fetch("/api/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentMethodId: paymentMethod.id,
        amount,
        listingId,
      }),
    });

    const paymentResult = await res.json();
    setLoading(false);

    if (paymentResult.error) {
      setError(paymentResult.error);
    } else {
      // Payment successful
      alert("Payment Successful!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-blue-600 text-white mt-4 py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay $${amount.toLocaleString("en-US")}`}
      </button>
    </form>
  );
};

export default PaymentForm;
