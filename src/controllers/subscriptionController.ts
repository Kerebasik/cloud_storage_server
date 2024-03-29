import { Request, Response } from 'express';
import { RequestWithBody, RequestWithQuery } from '../types/requestType';
import Subscription, { ISubscription } from '../models/subscriptionModel';
import { ServerStatus } from '../enums/server/serverStatus';
import { HydratedDocument } from 'mongoose';
import {
  ServerMessage,
  ServerMessageSubscription,
} from '../enums/server/serverMessage';

interface IInputBodyCreateSubscription {
  name: string;
  priceInCents: number;
  stripePriceApiId: string;
  diskStorage: number;
}
interface IInputBodyUpdateSubscription {
  _id: string;
  name: string;
  priceInCents: number;
  diskStorage: number;
  stripePriceApiId: string;
}

interface IInputQueryDeleteSubscription {
  _id: string;
}

export class SubscriptionController {
  static async create(
    req: RequestWithBody<IInputBodyCreateSubscription>,
    res: Response,
  ) {
    try {
      const { name, priceInCents, stripePriceApiId, diskStorage } = req.body;
      const newSubscription: HydratedDocument<ISubscription> = new Subscription(
        { name, priceInCents, stripePriceApiId, diskStorage },
      );
      await newSubscription.save();
      return res.status(ServerStatus.Ok).json(newSubscription);
    } catch (e) {
      console.log(e);
      return res.status(ServerStatus.Error).json(ServerMessage.Error);
    }
  }

  static async update(
    req: RequestWithBody<IInputBodyUpdateSubscription>,
    res: Response,
  ) {
    try {
      const { _id, name, priceInCents, stripePriceApiId, diskStorage } =
        req.body;
      await Subscription.findByIdAndUpdate(_id, {
        name,
        priceInCents,
        stripePriceApiId,
        diskStorage,
      });
      return res.status(ServerStatus.ObjectCreated).json();
    } catch (e) {
      console.log(e);
      return res.status(ServerStatus.Error).json(ServerMessage.Error);
    }
  }

  static async delete(
    req: RequestWithQuery<IInputQueryDeleteSubscription>,
    res: Response,
  ) {
    try {
      const { _id } = req.query;
      await Subscription.findByIdAndDelete(_id);
      return res
        .status(ServerStatus.ObjectCreated)
        .json(ServerMessageSubscription.WasDelete);
    } catch (e) {
      console.log(e);
      return res.status(ServerStatus.Error).json(ServerMessage.Error);
    }
  }

  static async getSubscriptionAll(req: Request, res: Response) {
    try {
      const search = req.query.search;
      let subscriptions;
      if (search) {
        subscriptions = await Subscription.findById(search);
      } else {
        subscriptions = await Subscription.find();
      }
      if (!subscriptions) {
        return res
          .status(ServerStatus.NotFound)
          .json(ServerMessageSubscription.NotFound);
      }
      return res.status(ServerStatus.Ok).json(subscriptions);
    } catch (e) {
      console.log(e);
      return res.status(ServerStatus.Error).json(ServerMessage.Error);
    }
  }
}
