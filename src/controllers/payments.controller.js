const { cartsService } = require("../repositories");
const PaymentsService = require("../services/payments.service");
const paymentsService = new PaymentsService();

class PaymentsController {
  static async makePaymentIntent(req, res) {
    const { cartId } = req.body;

    try {
      const cart = await cartsService.getById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }

      const total = await cartsService.calculateQuantityByPrice(cartId);

      const paymentInfo = {
        amount: total * 100,
        currency: "USD",
      };

      let result = await paymentsService.createPaymentIntent(paymentInfo);
      console.log(result);

      res.send({ status: "success", payload: result });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = PaymentsController;
