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
          "_id": "661f4919e7a934d777e3cf1f",
          "name": "XXX",
          "photo": "https://thispersondoesnotexist.com/"
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
          "_id": "661f4919e7a934d777e3cf1f",
          "name": "XXX",
          "photo": "https://thispersondoesnotexist.com/"
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
  /* #swagger.responses[200] = {
      description: 'New User created',
      schema: {
        "data": {
          "_id": "661f4919e7a934d777e3cf1f",
          "name": "XXX",
          "nickName": "XXX",
          "photo": "https://thispersondoesnotexist.com/,
          "email": "test@gmail.com",
          "mobile": "0911-000-000",
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
  /* #swagger.responses[200] = {
      description: 'User updated',
      schema: {
        "data": {
          "_id": "661f4919e7a934d777e3cf1f",
          "name": "XXX",
          "nickName": "XXX",
          "photo": "https://thispersondoesnotexist.com/,
          "email": "test@gmail.com",
          "mobile": "0911-000-000",
          "gender": "male",
          "birthday": "1990-01-01"
        }
      }
);
*/
  handleErrorAsync(userController.updateUser)
);

export default router;
