import express from 'express';
import { authController, organizerAuthController } from '../controllers';
import { validateBody } from '../middleware/validationMiddleware';
import { ogLoginSchema, ogRegistrationSchema } from '../validate/organizerSchemas';
import {
  authLoginSchema,
  authRefreshTokenSchema,
  authRegistrationSchema,
  authForgetPasswordScheme,
  authResetPasswordScheme
} from '../validate/authSchemas';
import { handleErrorAsync } from '../services/handleResponse';

const router = express.Router();

// 會員註冊
router.post(
  '/register',
  validateBody(authRegistrationSchema),
  /**
   * #swagger.tags = ['User Auth']
   * #swagger.description = '會員註冊'
   */
  /*
    #swagger.parameters['post'] = {
      in: 'body',
      description: '註冊',
      required: true,
      schema: {
        $name: 'name',
        $photo: 'https://thispersondoesnotexist.com/',
        $mobile: '0911000000',
        $email: 'email@gmail.com',
        $gender: 'male',
        $birthday: '1990-01-01',
        $password: 'password'
      }
    }
    #swagger.responses[200] = {
      description: '註冊成功回應',
      schema: {
        "data": {
          "_id": "xxxxxxxxxxxxxxxxxx",
          "name": "XXX",
          "photo": "https://thispersondoesnotexist.com/",
          "email": "test@gmail.com",
          "mobile": "0911000000",
          "gender": "male",
          "birthday": "1990-01-01"
        }
      }
    }
  */
  handleErrorAsync(authController.authRegister)
);
// 會員登入
router.post(
  '/login',
  validateBody(authLoginSchema),
  /**
   * #swagger.tags = ['User Auth']
   * #swagger.description = '會員登入'
   */
  /*
    #swagger.parameters['post'] = {
      in: 'body',
      description: '登入',
      required: true,
      schema: {
        $email: 'email',
        $password: 'password'
      }
    }
    #swagger.responses[200] = {
      description: '登入成功回應',
      schema: {
        "data": {
          "user": {
            "_id": "xxxxxxxxxxxxxxxxxx",
            "name": "XXX",
            "email": "test@gmail.com"
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
  handleErrorAsync(authController.authLogin)
);
// 會員 refresh token
router.post(
  '/refresh-token',
  validateBody(authRefreshTokenSchema),
  /**
   * #swagger.tags = ['User Auth']
   * #swagger.description = '更新登入token'
   */
  /*
    #swagger.parameters['post'] = {
      in: 'body',
      description: '更新token',
      required: true,
      schema: {
        "refresh_token": "xxxxxxxxxxxxxx"
      }
    }
    #swagger.responses[200] = {
      description: 'token交換成功回應',
      schema: {
        "data": {
          "access_token": "xxxxxxxxxxxxxx",
          "expires_in": 3600
        }
      },
      "message": "token交換成功"
      }
    }
  */
  handleErrorAsync(authController.authRefreshAccessToken)
);

// 主揪註冊
router.post(
  '/organizer/register',
  validateBody(ogRegistrationSchema),
  /**
    #swagger.tags = ['Organizer Auth']
    #swagger.description = '主揪註冊'
    #swagger.parameters['post'] = {
      in: 'body',
      description: '主揪註冊',
      required: true,
      schema: {
        $name: 'name',
        $nickName: 'nickName',
        $photo: 'https://thispersondoesnotexist.com',
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
          "name": "XXX",
          "nickName": 'nickName',
          "photo": "https://thispersondoesnotexist.com",
          "email": "test@gmail.com",
          "mobile": "0911000000",
          "profileDetail": "主揪的詳細資料",
          "profileTags": ['Camping', 'Hiking'],
          "area": "",
          "rating": [],
          "pwdAttempts": 0,
          "createdAt": "2024-05-16T06:50:19.045Z",
          "updatedAt": "2024-05-16T06:50:19.045Z"
        },
        "message": "註冊成功"
      }
    }
  */
  handleErrorAsync(organizerAuthController.authRegister)
);
// 主揪登入
router.post(
  '/organizer/login',
  validateBody(ogLoginSchema),
  /**
    #swagger.tags = ['Organizer Auth']
    #swagger.description = '主揪登入'
    #swagger.parameters['post'] = {
      in: 'body',
      description: '登入',
      required: true,
      schema: {
        $email: 'email',
        $password: 'password'
      }
    }
    #swagger.responses[200] = {
      description: '主揪登入成功回應',
      schema: {
        "data": {
          "organizer": {
            "_id": "xxxxxxxxxxxxxxxxxx",
            "name": "XXX",
            "nickName": 'nickName',
            "photo": "https://thispersondoesnotexist.com",
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
  handleErrorAsync(organizerAuthController.authLogin)
);
// 主揪忘記密碼
router.post(
  '/organizer/forget',
  validateBody(authForgetPasswordScheme),
  /**
    #swagger.tags = ['Organizer Auth']
    #swagger.description = '主揪忘記密碼'
    #swagger.parameters['post'] = {
      in: 'body',
      description: '主揪忘記密碼',
      required: true,
      schema: {
        $email: 'email',
      }
    }
    #swagger.responses[200] = {
      description: '忘記密碼成功回應',
      schema: {
        "message": "發送寄件成功"
      }
    }
  */
  handleErrorAsync(organizerAuthController.authForgetPassword)
);

// 忘記密碼
router.post(
  '/forget',
  validateBody(authForgetPasswordScheme),
  /**
    #swagger.tags = ['User Auth']
    #swagger.description = '忘記密碼'
    #swagger.parameters['post'] = {
      in: 'body',
      description: '忘記密碼',
      required: true,
      schema: {
        $email: 'email',
      }
    }
    #swagger.responses[200] = {
      description: '忘記密碼成功回應',
      schema: {
        "message": "發送寄件成功"
      }
    }
  */
  handleErrorAsync(authController.authForgetPassword)
);
// 重置密碼
router.post(
  '/forget/confirm',
  validateBody(authResetPasswordScheme),
  /**
    #swagger.tags = ['User Auth']
    #swagger.description = '更換新密碼'
    #swagger.parameters['post'] = {
      in: 'body',
      description: '更換新密碼',
      required: true,
      schema: {
        $resetToken: 'xxxxxxxxxxx',
        $password: 'xxxxxxxxx'
      }
    }
    #swagger.responses[200] = {
      description: '更換新密碼成功回應',
      schema: {
        "message": "密碼重置成功"
      }
    }
  */
  handleErrorAsync(authController.authResetPassword)
);

export default router;
