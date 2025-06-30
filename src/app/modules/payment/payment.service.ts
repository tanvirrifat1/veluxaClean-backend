import Stripe from 'stripe';
import { Payment } from './payment.model';
import { Types } from 'mongoose';
import { CleaningService } from '../service/service.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { TPayment } from './payment.constant';
import { Booking } from '../booking/booking.model';
import { stripe } from '../../../shared/stripe';

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

      if (paymentRecord.status === 'complete') {
        await Booking.findOneAndUpdate(
          { user: userId, service, status: 'pending' },
          { $set: { status: 'completed' } },
          { new: true, sort: { createdAt: -1 } }
        );
      }

      await paymentRecord.save();
      break;
    }

    case 'checkout.session.async_payment_failed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { payment_intent } = session;
      const payment = await Payment.findOne({ transactionId: payment_intent });
      if (payment) {
        payment.status = 'failed';
        await payment.save();
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

const getAllPayment = async (query: Record<string, unknown>) => {
  const { page, limit } = query;
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;
  const result = await Payment.find({ status: 'complete' })
    .populate({
      path: 'user',
      select: 'name email -_id',
    })
    .populate({
      path: 'service',
    })
    .sort('-createdAt')
    .skip(skip)
    .limit(size)
    .lean();
  const total = await Payment.countDocuments({ status: 'complete' });
  const data: any = {
    result,
    meta: {
      page: pages,
      limit: size,
      total,
    },
  };
  return data;
};

export const PaymentService = {
  createCheckoutSessionService,
  handleStripeWebhookService,
  getAllPayment,
};
