import { Request, Response } from 'express';
import { PaymentService, stripe } from './payment.service';
import config from '../../../config';

const createCheckoutSessionController = async (req: Request, res: Response) => {
  const user: string = req.user.id;
  const email: string = req.user.email;

  const { service } = req.body;

  const value = {
    user,
    email,
    service,
  };

  try {
    const sessionUrl = await PaymentService.createCheckoutSessionService(value);
    res.status(200).json({ url: sessionUrl });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
};

const stripeWebhookController = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      config.payment.stripe_webhook_secret as string
    );

    await PaymentService.handleStripeWebhookService(event);

    res.status(200).send({ received: true });
  } catch (err: any) {
    res.status(400).send(`Webhook Error:${err.message}`);
  }
};

export const PaymentController = {
  createCheckoutSessionController,
  stripeWebhookController,
};
