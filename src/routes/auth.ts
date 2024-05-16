import express from 'express';
import { authController, organizerAuthController } from '../controllers';
import { validateBody } from '../middleware/validationMiddleware';
import { organizerLoginSchema, organizerRegistrationSchema } from '../validate/organizerSchemas';

const router = express.Router();

router.post('/login', authController.authLogin);
router.post('/refresh-token', authController.generateAccessToken);

// 主揪註冊
router.post(
  '/organizer/register',
  /**
   * #swagger.tags = ['Organizer Auth']
   * #swagger.description = '主揪註冊'
   */
  /*
    #swagger.parameters['post'] = {
      in: 'body',
      description: '主揪註冊',
      required: true,
      schema: {
        $username: 'name',
        $nickName: 'nickName',
        $photo: 'https://thispersondoesnotexist.com/',
        $mobile: '0911000000',
        $email: 'email@gmail.com',
        $profileDetail: '主揪的詳細資料',
        $profileTags: ['Camping', 'Hiking'],
        $area: 'Taipei',
        $password: 'password'
      }
    }
    #swagger.responses[200] = {
      description: '主揪註冊成功回應',
      schema: {
        "data": {
          "_id": "xxxxxxxxxxxxxxxxxx",
          "username": "XXX",
          "nickName": 'nickName',
          "photo": "https://thispersondoesnotexist.com/",
          "email": "test@gmail.com",
          "mobile": "0911000000",
          "profileDetail": "主揪的詳細資料",
          "profileTags": ['Camping', 'Hiking'],
          "area": "",
          "createdAt": "2024-05-16T06:50:19.045Z",
          "updatedAt": "2024-05-16T06:50:19.045Z"
        },
        "message": "註冊成功"
      }
    }
  */
  validateBody(organizerRegistrationSchema),
  organizerAuthController.authRegister
);
// 主揪登入
router.post(
  '/organizer/login',
  /**
   * #swagger.tags = ['Organizer Auth']
   * #swagger.description = '主揪登入'
   */
  /*
    #swagger.parameters['post'] = {
      in: 'body',
      description: '登入',
      required: true,
      schema: {
        $email: 'email@gmail.com',
        $password: 'password'
      }
    }
    #swagger.responses[200] = {
      description: '主揪登入成功回應',
      schema: {
        "data": {
          "organizer": {
            "_id": "xxxxxxxxxxxxxxxxxx",
            "username": "XXX",
            "nickName": 'nickName',
            "photo": "https://thispersondoesnotexist.com/",
            "email": "test@gmail.com",
            "mobile": "0911000000"
          },
          "token": {
            "access_token": "xxxxxxxxxxxxxx",
            "expires_in": 604800,
            "refresh_token": "xxxxxxxxxxxxxx"
          }
        },
        "message": "登入成功"
      }
    }
  */
  validateBody(organizerLoginSchema),
  organizerAuthController.authLogin
);

export default router;
