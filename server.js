require('dotenv').config()
const express = require('express');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Replace 'YourSecretKey' with your actual Stripe secret key.

const app = express();
const port = 3000; // You can choose any available port you prefer.

app.use(express.json());

app.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: '2023-08-16' }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'aud',
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY, // Replace 'YourPublicKey' with your actual Stripe public key.
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});