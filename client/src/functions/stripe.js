import axios from "axios";

export const createPaymentIntent = (authtoken, coupon, tokens) =>
  axios.post(
    `${process.env.REACT_APP_API}/create-payment-intent`,
    {
      couponApplied: coupon,
      tokensApplied: tokens,
    },
    {
      headers: {
        authtoken,
      },
    }
  );
