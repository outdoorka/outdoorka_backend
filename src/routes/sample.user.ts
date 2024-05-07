import express from 'express';
import { userSampleController } from '../controllers';
import { handleErrorAsync } from '../services/handleResponse';

const router = express.Router();

router.get(
  '/',
  /**
   * #swagger.tags = ['SampleUser']
   * #swagger.description = '取得所有User資料'
   */
  /* #swagger.responses[200] = {
      description: '取得所有User資料',
      schema: {
        "data": [{
          "_id": "xxxxxxxxxxxxxxxxxxxx",
          "name": "XXX",
          "photo": "https://thispersondoesnotexist.com/"
        }]
      }
    }
  */

  handleErrorAsync(userSampleController.getUserList)
);

router.get(
  '/:id',
  /**
   * #swagger.tags = ['SampleUser']
   * #swagger.description = '取得User資料'
   */
  /**
    #swagger.responses[200] = {
      description: '取得User資料',
      schema: {
        "data": {
          "_id": "xxxxxxxxxxxxxxxxxxxx",
          "name": "XXX",
          "photo": "https://thispersondoesnotexist.com/"
        }
      }
    }
  */
  handleErrorAsync(userSampleController.getUser)
);

// swagger 加上 Bearer Token 驗證例子：#swagger.security = [{ "bearerAuth": [] }]
export default router;
