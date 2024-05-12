import express from 'express';
import { userController } from '../controllers';
import { handleErrorAsync } from '../services/handleResponse';

const router = express.Router();

router.get(
  '/',
  /**
   * #swagger.tags = ['User']
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
  '/:id',
  /**
   * #swagger.tags = ['User']
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
router.post(
  '/',
  /**
   * #swagger.tags = ['User']
   * #swagger.description = 'Create a new User'
   */
  /*
    #swagger.parameters['post'] = {
      in: 'body',
      description: '會員註冊',
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
      description: 'New User created',
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
  handleErrorAsync(userController.createUser)
);
router.delete(
  '/:id',
  /**
   * #swagger.tags = ['User']
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
  '/:id',
  /**
   * #swagger.tags = ['User']
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
  '/:id/email',
  /**
   * #swagger.tags = ['User']
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
  '/:id/password',
  /**
   * #swagger.tags = ['User']
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
