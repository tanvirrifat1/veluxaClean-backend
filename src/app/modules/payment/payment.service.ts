import Stripe from 'stripe';
import config from '../../../config';
import { Payment } from './payment.model';
import { Types } from 'mongoose';
import { CleaningService } from '../service/service.model';

export const stripe = new Stripe(config.payment.stripe_secret_key as string, {
  apiVersion: '2025-01-27.acacia',
});

const createCheckoutSessionService = async (
  user: string,
  email: string,
  service: string
) => {
  const isServiceExist = await CleaningService.findById(service);

  console.log(isServiceExist);

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: isServiceExist?.serviceName as string,
            },
            unit_amount: (isServiceExist?.price as number) * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email,
      success_url:
        'https://yourapp.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://yourapp.com/cancel',
      metadata: {
        user,
        service,
      },
    });

    return session.url;
  } catch (error) {
    throw new Error('Failed to create checkout session');
  }
};

const handleStripeWebhookService = async (event: Stripe.Event) => {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      const { amount_total, metadata, payment_intent, status } = session;
      const userId = metadata?.userId as string;
      const products = JSON.parse(metadata?.products || '[]');
      const email = session.customer_email || '';

      const amountTotal = (amount_total ?? 0) / 100;

      const paymentRecord = new Payment({
        amount: amountTotal,
        user: new Types.ObjectId(userId),
        service: new Types.ObjectId(products[0]),
        email,
        transactionId: payment_intent,
        status: status,
      });

      await paymentRecord.save();
      break;
    }

    case 'checkout.session.async_payment_failed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(session);
      const { client_secret } = session;
      const payment = await Payment.findOne({ client_secret });
      if (payment) {
        payment.status = 'Failed';
        await payment.save();
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

export const PaymentService = {
  createCheckoutSessionService,
  handleStripeWebhookService,
};
