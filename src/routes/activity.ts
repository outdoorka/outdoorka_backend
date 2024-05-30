import express from 'express';
import { activityController } from '../controllers';
import { isAuth } from '../services/handleAuth';
import { handleErrorAsync } from '../services/handleResponse';
const router = express.Router();

router.get(
  '/homelist',
  handleErrorAsync(activityController.getActivityHomeList)
  /**
   * #swagger.tags = ['Activity']
   * #swagger.description = '取得首頁的熱門活動/最新活動資料'
   */
  /*
  #swagger.parameters['get'] = {
      in: 'query',
      name: 'type',
      description: '請填HOT或NEW。HOT(熱門活動),NEW(最新活動)',
      required: true,
      schema: {
        type: 'string',
      }
    }
  #swagger.responses[200] = {
      description: '取得首頁的熱門活動/最新活動資料',
      schema: {
			     "data": [
              {
                "_id": "664cb717ae8e74de4ae74873",
                "organizerId": {
                  "_id": "664caee7ae10d7e7604c4feb",
                  "username": "拼圖戶外生活",
                  "photo": "https://static.accupass.com/org/2005260527172844358540.jpg"
                },
                "subtitle": "大屯溪古道上小觀音山｜拼圖戶外生活 X 山旅戶外",
                "region": "Northern",
                "city": "Taipei",
                "activityImageUrls": [
                  "XXXX",
                  "XXXX",
                  "XXXX"
                ],
                "activityStartTime": "2024-07-10T08:00:00.537Z",
                "activityEndTime": "1970-01-01T00:00:00.000Z",
                "likers": [],
                "bookedCapacity": 12
              }
            ],
            "message": "取得成功"
      }
    }
  */
);

router.get(
  '/:id',
  isAuth,
  handleErrorAsync(activityController.getActivity)
  /**
   * #swagger.tags = ['Activity']
   * #swagger.description = '跟團仔角度-取得活動詳細資料'
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  /*
  #swagger.responses[200] = {
      description: '跟團仔角度-取得活動詳細資料',
      schema: {
        "data": {
          "_id": "664cb717ae8e74de4ae74872",
          "title": "新手釣魚團-北海岸淺水灣紅燈防波堤釣點",
          "subtitle": "新手釣魚團-北海岸淺水灣紅燈防波堤釣點",
          "address": "address 最多100個字",
          "location": "location 最多100個字",
          "region": "北部",
          "activityLinks": [
            {
              "name": "name 最多50個字",
              "url": "https://www.google.com/",
              "_id": "664da320952a06a2b9c25e02"
            },
            {
              "name": "name 最多50個字123ewq",
              "url": "https://www.google.com/",
              "_id": "664da320952a06a2b9c25e03"
            }
          ],
          "activityDetail": "activityDetail 最多1000個字",
          "activityNote": "activityNotice 最多200個字",
          "activityTags": [
            "Camping",
            "Hiking"
          ],
          "activityImageUrls": [
            "XXX",
            "XXX",
            "XXX"
          ],
          "price": 600,
          "activitySignupStartTime": "2024-05-17T06:39:19.740Z",
          "activitySignupEndTime": "2024-06-15T06:39:19.740Z",
          "activityStartTime": "2024-07-20T00:00:00.537Z",
          "activityEndTime": "2024-07-21T10:00:00.000Z",
          "bookedCapacity": 2,
          "remainingCapacity": 18,
          "organizer": {
            "_id": "664ca866ae10d7e7604c4fe7",
            "email": "email2@gmail.com",
            "photo": "https://static.accupass.com/org/2304041722089876493900.jpg",
            "rating": 4
          },
          "isLiked": true
        },
        "message": "取得成功"
      }
    }
  */
);
export default router;
