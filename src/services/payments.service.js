const { stripeSecretKey } = require("../config/config");
const Stripe = require("stripe");

class PaymentsService {
  constructor() {
    this.stripe = new Stripe(stripeSecretKey);
  }
  async createPaymentIntent(paymentInfo) {
    const paymentIntent = await this.stripe.paymentIntents.create(paymentInfo);
    return paymentIntent;
  }
}

module.exports = PaymentsService;
