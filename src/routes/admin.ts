import express from 'express';
import { adminController } from '../controllers';
import { handleErrorAsync } from '../services/handleResponse';
import { validateBody } from '../middleware/validationMiddleware';
import { authorizeAccessSchema } from '../validate/adminSchemas';

const router = express.Router();

router.post(
  '/authorizeAccess',
  validateBody(authorizeAccessSchema),
  /**
    #swagger.tags = ['Admin']
    #swagger.description = '開通主揪'
      #swagger.parameters['post'] = {
        in: 'body',
        description: '開通',
        required: true,
        schema: {
          $id: 'xxxxxxxxxxxxxxxxx',
          $email: 'email@gmail.com'
        }
      }
    #swagger.responses[200] = {
      description: '開通成功回應',
      schema: {
        "data": {
          "_id": "xxxxxxxxxxxxxxxxxx",
          "email": "xxxxxx@gmail.com",
          "isActive": true,
          "name": "xxxxxx",
          "nickName": "RR",
          "mobile": "0911000000",
          "photo": "https://thispersondoesnotexist.com/",
          "profileDetail": "主揪的詳細資料",
          "profileTags": [
            "Camping",
            "Hiking"
          ],
          "area": "Taipei",
          "pwdAttempts": 0,
          "rating": [],
          "createdAt": "2024-05-16T06:42:19.740Z",
          "updatedAt": "2024-05-16T06:42:19.740Z"
        }
      }
    }
  */
  handleErrorAsync(adminController.setAuthorizeAccess)
);

export default router;
