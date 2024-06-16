import express from 'express';
import { paymentController } from '../controllers';
import { handleErrorAsync } from '../services/handleResponse';
import { isAuth } from '../services/handleAuth';
import { validateBody } from '../middleware/validationMiddleware';
import { createPaymentSchema } from '../validate/paymentSchemas';
const router = express.Router();

// 使用者購買活動票券
router.post(
  '/registration',
  isAuth,
  validateBody(createPaymentSchema),
  handleErrorAsync(paymentController.createPayment)
  /**
   * #swagger.tags = ['Payment']
   * #swagger.description = '使用者購買活動票券-成立訂單'
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  /*
    #swagger.parameters['post'] = {
      in: 'body',
      description: '使用者購買活動票券',
      required: true,
      schema: {
        $activityId: 'xxxxxxxxxxxxxxxxxx',
        $ticketCount: 1,
        $buyerName: 'name',
        $buyerMobile: '0911000000',
        $buyerEmail: 'email@gmail.com'
      }
    }
    #swagger.responses[200] = {
      description: '建立成功',
      schema: {
        "data": {
          "_id": "xxxxxxxxxxxxxxxxxx",
          "ticketCount": 1,
          "totalPrice": 1000,
        }
      }
    }
  */
);

// 金流回傳付款結果
router.post(
  '/result',
  handleErrorAsync(paymentController.updatePaymentResult)
  /**
   * #swagger.tags = ['Payment']
   * #swagger.description = '金流回傳付款結果'
   */
  /*
  #swagger.responses[200] = {
      description: '金流回傳付款結果成功',
      schema: {
        "data": {
                  "paymentStatus": "paid",
        },
        "message": "成功"
      }

    }
  */
);
export default router;
