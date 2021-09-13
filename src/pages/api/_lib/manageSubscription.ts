import { query as q } from 'faunadb'

import { fauna } from "../../../services/fauna";
import { stripe } from '../../../services/stripe';

export async function saveSubscription(subscriptionId: string, customerId: string, createAction = false) {
  // get from faunadb the ref of the user using index user_by_stripe_cusomter_id
  const userRef = await fauna.query(
    q.Select(
      'ref',
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  )

  // get from stripe all subscription info (using retrieve gets only 1)
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  }

  if (createAction) {
    // creating a document inside subscriptions containing subscriptionData
    await fauna.query(
      q.Create(
        q.Collection('subscriptions'),
        { data: subscriptionData }
      )
    )
  } else {
    await fauna.query(
      q.Replace(  // replace will replace all the document, not only update a field
        q.Select( // Making a replace make it more dynamic to recieve more data in the future
          'ref',
          q.Get(
            q.Match(
              q.Index('subscription_by_id',),
              subscriptionId
            )
          )
        ),
        { data: subscriptionData }
      )
    )
  }
}