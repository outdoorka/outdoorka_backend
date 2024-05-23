import express from 'express';
import { organizerController } from '../controllers';
import { handleErrorAsync } from '../services/handleResponse';
import { isOgAuth } from '../services/handleAuth';
import { validateBody, validateImage } from '../middleware/validationMiddleware';
import { createActivitySchema } from '../validate/activitiesSchemas';

const router = express.Router();

// 主揪建立活動
router.post(
  '/activities',
  isOgAuth,
  validateBody(createActivitySchema),
  /**
    #swagger.tags = ['Organizer']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.description = '建立活動'
    #swagger.parameters['post'] = {
        in: 'body',
        description: '輸入活動資訊',
        required: true,
        schema: {
          title: 'title 最多100個字',
          subtitle: 'subtitle 最多100個字',
          price: 600,
          totalCapacity: 20,
          city: '臺北市',
          address: 'address 最多100個字',
          location: 'location 最多100個字',
          activityDetail: 'activityDetail 最多1000個字',
          activityNotice: 'activityNotice 最多200個字',
          activityTags: ['Camping', 'Hiking'],
          activityLinks: [{
            name: 'name 最多50個字',
            url: 'https://www.google.com/'
          }],
          activityImageUrls: ['https://thispersondoesnotexist.com/'],
          isPublish: false,
          activitySignupStartTime: '2024-05-17T06:39:19.740Z',
          activitySignupEndTime: '2024-06-15T06:39:19.740Z',
          activityStartTime: '2024-06-17T00:39:19.740Z',
          activityEndTime: '2024-06-17T06:39:19.740Z'
        }
      }
    #swagger.responses[200] = {
      description: '建立成功回應',
      schema: {
        "data": {
          "_id": "xxxxxxxxxxxxxxxxxx",
          "organizer": {
            "_id": "xxxxxxxxxxxxxxxxxx",
            "email": "xxxxxx@gmail.com",
            "photo": "https://thispersondoesnotexist.com/"
          },
          "title": "title 最多100個字",
          "subtitle": "subtitle 最多100個字",
          "price": 600,
          "totalCapacity": 20,
          "region": "北部",
          "city": "臺北市",
          "address": "address 最多100個字",
          "location": "location 最多100個字",
          "activityDetail": "activityDetail 最多1000個字",
          "activityNotice": "activityNotice 最多200個字",
          "activityTags": [
            "Camping",
            "Hiking"
          ],
          "activityLinks": [
            [
              {
                "name": "name 最多50個字",
                "url": "https://www.google.com/",
                "_id": "664d813a375ad2f7a00e087c"
              }
            ]
          ],
          "activityImageUrls": [
            [
              "https://thispersondoesnotexist.com/"
            ]
          ],
          "isPublish": false,
          "activitySignupStartTime": "2024-05-17T06:39:19.740Z",
          "activitySignupEndTime": "2024-06-15T06:39:19.740Z",
          "activityStartTime": "2024-06-17T00:39:19.740Z",
          "activityEndTime": "2024-06-17T06:39:19.740Z",
          "likers": [],
          "createdAt": "2024-05-22T05:23:06.124Z",
          "updatedAt": "2024-05-22T05:23:06.124Z"
        }
      }
    }
  */
  handleErrorAsync(organizerController.createActivity)
);

// 主揪上傳圖片
router.post(
  '/imageUpload',
  isOgAuth,
  validateImage,
  /**
    #swagger.tags = ['Organizer']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.description = '上傳圖片'
    #swagger.parameters['post'] = {
        in: 'formData',
        description: '上傳圖片',
        required: true,
        type: 'file'
      }
    #swagger.responses[200] = {
      description: '上傳成功回應',
      schema: {
        "data": {
          "message": "上傳成功",
          "url": "https://xxxxxxx.com/xxxxxxxxxxxxxxxxxx.jpg"
        },
        "message": "上傳成功"
      }
    }
  */
  handleErrorAsync(organizerController.imageUpload)
);

export default router;
