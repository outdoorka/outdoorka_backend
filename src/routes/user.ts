import express from 'express';
import { userController } from '../controllers';
import { handleErrorAsync } from '../services/handleResponse';
import { isAuth } from '../services/handleAuth';
import { validateBody } from '../middleware/validationMiddleware';
import {
  userUpdateEmailSchema,
  userUpdatePwdSchema,
  userUpdateSchema
} from '../validate/userSchemas';

const router = express.Router();

router.get(
  '/all',
  isAuth,
  /**
   * #swagger.tags = ['User']
   * #swagger.security = [{ "bearerAuth": [] }]
   * #swagger.description = '取得所有User資料'
   */
  /* #swagger.responses[200] = {
      description: '取得所有User資料',
      schema: {
        "data": [{
          "_id": "xxxxxxxxxxxxxxxxxx",
          "name": "XXX",
          "photo": "https://thispersondoesnotexist.com/",
          "email": "xxxxxx@gmail.com",
          "isActive": true,
          "mobile": "0911000000",
          "gender": "male",
          "birthday": "1990-01-01"
        }]
      }
    }
  */
  handleErrorAsync(userController.getUserList)
);
router.get(
  '/',
  isAuth,
  /**
   * #swagger.tags = ['User']
   * #swagger.security = [{ "bearerAuth": [] }]
   * #swagger.description = '取得User資料'
   */
  /**
    #swagger.responses[200] = {
      description: '取得User資料',
      schema: {
        "data": {
          "_id": "xxxxxxxxxxxxxxxxxx",
          "name": "XXX",
          "photo": "https://thispersondoesnotexist.com/",
          "email": "xxxxxx@gmail.com",
          "isActive": true,
          "mobile": "0911000000",
          "gender": "male",
          "birthday": "1990-01-01"
        }
      }
    }
  */
  handleErrorAsync(userController.getUser)
);
router.delete(
  '/',
  isAuth,
  /**
   * #swagger.tags = ['User']
   * #swagger.security = [{ "bearerAuth": [] }]
   * #swagger.description = 'Delete User'
   */
  /* #swagger.responses[200] = {
      description: 'User deleted',
      schema: {
        "data": []
      }
    }
  */
  handleErrorAsync(userController.deleteUser)
);
router.patch(
  '/',
  isAuth,
  validateBody(userUpdateSchema),
  /**
   * #swagger.tags = ['User']
   * #swagger.security = [{ "bearerAuth": [] }]
   * #swagger.description = 'Update User'
   */
  /*
    #swagger.parameters['patch'] = {
      in: 'body',
      description: '會員修改資料',
      required: true,
      schema: {
        $name: 'name',
        $photo: 'https://thispersondoesnotexist.com/',
        $mobile: '0911000000',
        $gender: 'male',
        $birthday: '1990-01-01'
      }
    }
    #swagger.responses[200] = {
      description: '取得User資料',
      schema: {
        "data": {
          "_id": "xxxxxxxxxxxxxxxxxx",
          "name": "XXX",
          "photo": "https://thispersondoesnotexist.com/",
          "email": "xxxxxx@gmail.com",
          "isActive": true,
          "mobile": "0911000000",
          "gender": "male",
          "birthday": "1990-01-01"
        }
      }
    }
  */
  handleErrorAsync(userController.updateUser)
);
router.patch(
  '/email',
  isAuth,
  validateBody(userUpdateEmailSchema),
  /**
   * #swagger.tags = ['User']
   * #swagger.security = [{ "bearerAuth": [] }]
   * #swagger.description = 'Update User Email'
   */
  /*
    #swagger.parameters['patch'] = {
      in: 'body',
      description: '修改會員的 Email 資料',
      required: true,
      schema: {
        $email: 'email@gmail.com',
        $password: 'xxxxxxx'
      }
    }
    #swagger.responses[200] = {
      description: 'User資料',
      schema: {
        "data": {
          "_id": "xxxxxxxxxxxxxxxxxx",
          "name": "XXX",
          "photo": "https://thispersondoesnotexist.com/",
          "email": "xxxxxx@gmail.com",
          "isActive": true,
          "mobile": "0911000000",
          "gender": "male",
          "birthday": "1990-01-01"
        }
      }
    }
  */
  handleErrorAsync(userController.updateUserEmail)
);
router.patch(
  '/password',
  isAuth,
  validateBody(userUpdatePwdSchema),
  /**
   * #swagger.tags = ['User']
   * #swagger.security = [{ "bearerAuth": [] }]
   * #swagger.description = 'Update User 密碼'
   */
  /*
    #swagger.parameters['patch'] = {
      in: 'body',
      description: '修改會員的 密碼 資料',
      required: true,
      schema: {
        $password: 'xxxxxxx',
        $newPassword: 'xxxxxxx',
        $confirmPassword: 'xxxxxxx'
      }
    }
    #swagger.responses[200] = {
      description: 'User資料',
      schema: {
        "data": {
          "_id": "xxxxxxxxxxxxxxxxxx",
          "name": "XXX",
          "photo": "https://thispersondoesnotexist.com/",
          "email": "xxxxxx@gmail.com",
          "isActive": true,
          "mobile": "0911000000",
          "gender": "male",
          "birthday": "1990-01-01"
        }
      }
    }
  */
  handleErrorAsync(userController.updateUserPassword)
);

export default router;
