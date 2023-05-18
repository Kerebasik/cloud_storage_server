import Router from 'express';
import { SubscriptionController } from '../controllers/subscriptionController';

const subscriptionRouter = Router();

subscriptionRouter.get('/find', SubscriptionController.getSubscriptionAll);
subscriptionRouter.post('/create', SubscriptionController.create);
subscriptionRouter.patch('/update', SubscriptionController.update);
subscriptionRouter.delete('/delete', SubscriptionController.delete);

export default subscriptionRouter;
