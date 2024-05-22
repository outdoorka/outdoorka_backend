import express from 'express';
import { activityController } from '../controllers';

const router = express.Router();

router.get(
  '/homelist',
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
  activityController.getActivityHomeList
);

export default router;
