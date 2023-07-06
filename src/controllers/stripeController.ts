import { RequestWithBody } from '../types/requestType';
import { Response, Request } from 'express';
import { ServerStatus } from '../enums/server/serverStatus';
import { ServerMessage } from '../enums/server/serverMessage';
import User, { IUser } from '../models/userModel';
import Subscription, { ISubscription } from '../models/subscriptionModel';
import { HydratedDocument } from 'mongoose';
import { StripeCreateSessionsUrl } from '../services/stripeService';

export class StripeController {
  static async paymentSubscription(
    req: RequestWithBody<{ subscriptionId: string }>,
    res: Response<string>,
  ) {
    try {
      const { subscriptionId } = req.body;
      const subscription = (await Subscription.findById(
        subscriptionId,
      )) as HydratedDocument<ISubscription>;
      const linkForRedirect = await StripeCreateSessionsUrl(
        `${subscription.stripePriceApiId}`,
        req.userId,
      );
      //return res.redirect(linkForRedirect);
      return res.json(linkForRedirect);
    } catch (e) {
      console.log(e);
      return res.status(ServerStatus.Error).json(ServerMessage.Error);
    }
  }

  static async successSubscription(req: Request, res: Response) {
    const { priceId, userId } = req.params;
    const user = (await User.findById(userId)) as HydratedDocument<IUser>;
    const subscription = (await Subscription.findOne({
      stripePriceApiId: priceId,
    })) as HydratedDocument<ISubscription>;
    user.subscription = subscription._id;
    await user.save();
    return res.redirect(`${process.env.CLIENT_URL}/subscriptions`)
  }
}
