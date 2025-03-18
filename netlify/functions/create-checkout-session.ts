import {Handler} from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {statusCode: 200, headers, body: ''};
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({error: 'Method not allowed'})
    };
  }

  try {
    console.log('Function called with event:', JSON.stringify(event));

    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({error: 'Request body is required'})
      };
    }

    let priceId, userId, userEmail;
    try {
      const parsedBody = JSON.parse(event.body);
      priceId = parsedBody.priceId;
      userId = parsedBody.userId; // Retrieve user ID from the request body
      userEmail = parsedBody.userEmail; // Retrieve user email from the request body

      // console.log('Received priceId:', priceId);
      // console.log('Received userId:', userId);
      // console.log('Received userEmail:', userEmail);
    } catch (e) {
      console.error('JSON parsing error:', e);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({error: 'Invalid JSON in request body'})
      };
    }

    if (!priceId || !userId || !userEmail) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({error: 'Price ID, User ID, and User Email are required'})
      };
    }

    console.log('Creating Stripe session with price:', priceId);

    // Create a Stripe Checkout session with user metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: userEmail,
      line_items: [{price: priceId, quantity: 1}],
      mode: 'subscription',
      success_url: `${process.env.STRIPE_PAYMENT_URL || 'http://localhost:8888/checkout/'}?success=true`,
      cancel_url: `${process.env.STRIPE_PAYMENT_URL || 'http://localhost:8888/checkout/'}?canceled=true`,
      metadata: {
        user_id: userId,
      },
    });

    console.log('Session created:', session.id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({sessionId: session.id})
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({error: error instanceof Error ? error.message : 'Internal server error'})
    };
  }
};

export {handler};
