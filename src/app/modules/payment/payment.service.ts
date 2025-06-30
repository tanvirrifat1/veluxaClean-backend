import Stripe from 'stripe';
import config from '../../../config';
import { Payment } from './payment.model';
import { Types } from 'mongoose';
import { CleaningService } from '../service/service.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { TPayment } from './payment.constant';

export const stripe = new Stripe(config.payment.stripe_secret_key as string, {
  apiVersion: '2025-01-27.acacia',
});

const createCheckoutSessionService = async (payload: TPayment) => {
  const isServiceExist = await CleaningService.findById(payload.service);

  if (!isServiceExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found');
  }

  const user = payload.user;

  const service = payload.service;

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
      customer_email: payload.email,
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

      console.log(session);

      const { amount_total, metadata, payment_intent, status } = session;
      const userId = metadata?.user as string;
      const service = metadata?.service;
      const email = session.customer_email || '';

      const amountTotal = (amount_total ?? 0) / 100;

      const paymentRecord = new Payment({
        amount: amountTotal,
        user: new Types.ObjectId(userId),
        service: new Types.ObjectId(service),
        email,
        transactionId: payment_intent,
        status,
      });

      await paymentRecord.save();
      break;
    }

    case 'checkout.session.async_payment_failed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { payment_intent } = session;
      const payment = await Payment.findOne({ transactionId: payment_intent });
      if (payment) {
        payment.status = 'Failed';
        await payment.save();
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

export const PaymentService = {
  createCheckoutSessionService,
  handleStripeWebhookService,
};
