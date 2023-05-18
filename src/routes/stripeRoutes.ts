import Router from 'express';
import { StripeController } from '../controllers/stripeController';
import authMiddleware from '../middleware/authMiddleware';
const stripeRouter = Router();

stripeRouter.post('/', authMiddleware, StripeController.paymentSubscription);
stripeRouter.get(
  '/success/:priceId/:userId',
  StripeController.successSubscription,
);

export default stripeRouter;
