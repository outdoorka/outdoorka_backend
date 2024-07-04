import express from 'express';
import { activityController } from '../controllers';
import { validateBody } from '../middleware/validationMiddleware';
import { getActivityListSchema } from '../validate/activitiesSchemas';

import { isAuth } from '../services/handleAuth';
import { handleErrorAsync } from '../services/handleResponse';
const router = express.Router();

// 取得首頁的熱門活動/最新活動資料
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
                  "name": "拼圖戶外生活",
                  "photo": "https://static.accupass.com/org/2005260527172844358540.jpg"
                },
                "title":"大屯溪古道上小觀音山｜拼圖戶外生活 X 山旅戶外",
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
                "likeCount": 0,
                "bookedCapacity": 12,
                "popularity":0
              }
            ],
            "message": "取得成功"
      }
    }
  */
);
router.get(
  '/list',
  validateBody(getActivityListSchema),
  handleErrorAsync(activityController.getActivityList)
  /**
   * #swagger.tags = ['Activity']
   * #swagger.description = '取得活動列表清單'
   */
  /*
  #swagger.parameters['perPage'] = {
    in: 'query',
    name: 'perPage',
    description: '顯示幾筆資料，預設10筆',
    required: false,
    schema: {
      type: 'number',
      default: 10
    }
  }
  #swagger.parameters['cursor'] = {
    in: 'query',
    name: 'cursor',
    description: '第一筆或最後一筆的游標ID',
    required: false,
    schema: {
      type: 'string'
    }
  }
  #swagger.parameters['direction'] = {
    in: 'query',
    name: 'direction',
    description: '往下或往上查找(forward, backward)',
    required: false,
    schema: {
      type: 'string'
    }
  }
  #swagger.parameters['keyword'] = {
    in: 'query',
    name: 'keyword',
    description: '關鍵字查詢，目前搜尋標題內包含關鍵字的活動',
    required: false,
    schema: {
      type: 'string',
    }
  }
  #swagger.parameters['startTime'] = {
    in: 'query',
    name: 'startTime',
    description: '活動開始時間(搜尋區間的起始時間)',
    required: false,
    schema: {
      type: 'string',
    }
  }
  #swagger.parameters['endTime'] = {
    in: 'query',
    name: 'endTime',
    description: '活動開始時間(搜尋區間的結束時間)',
    required: false,
    schema: {
      type: 'string',
    }
  }
  #swagger.parameters['region'] = {
    in: 'query',
    name: 'region',
    description: '活動區域(Northern,Central,Southern,Eastern,Overseas)',
    required: false,
    schema: {
      type: 'string',
    }
  }
  #swagger.parameters['theme'] = {
    in: 'query',
    name: 'theme',
    description: '活動類別(Camping, Climbing, Hiking, Sports, Surfing, Excursion, Trip)',
    required: false,
    schema: {
      type: 'string',
    }
  }
  #swagger.parameters['capacity'] = {
    in: 'query',
    name: 'capacity',
    description: '活動規模，1-5分別對應的意思是: 1: 0-10人, 2: 11-30人, 3: 31-50人, 4: 51-100人, 5: 100人以上',
    required: false,
    schema: {
      type: 'integer',
    }
  }
  #swagger.parameters['rating'] = {
    in: 'query',
    name: 'rating',
    description: '主揪的分數，1-5',
    required: false,
    schema: {
      type: 'integer',
    }
  }
  #swagger.parameters['organizerId'] = {
    in: 'query',
    name: 'organizerId',
    description: '主揪ID，用來查詢特定主揪的活動',
    required: false,
    schema: {
      type: 'string',
    }
  }
  #swagger.parameters['sort'] = {
    in: 'query',
    name: 'sort',
    description: 'sorting的條件，目前有date_asc,date_desc,rating_asc,rating_desc,capacity_asc,capacity_desc,price_asc,price_desc 預設是date_asc',
    required: false,
    schema: {
      type: 'string',
    }
  }
  #swagger.responses[200] = {
      description: '取得活動列表清單',
      schema: {
    "data": [
        {
            "_id": "664cb717ae8e74de4ae74872",
            "title": "新手釣魚團-北海岸淺水灣紅燈防波堤釣點",
            "subtitle": "新手釣魚團-北海岸淺水灣紅燈防波堤釣點",
            "price": 600,
            "totalCapacity": 20,
            "region": "北部",
            "city": "新北市",
            "activityTags": [
                "Camping",
                "Hiking"
            ],
            "activityImageUrls": [
                "https://media.istockphoto.com/id/1367438696/photo/cute-redhead-boy-and-grandfather-fishing-in-the-river-in-quebec.jpg?s=612x612&w=0&k=20&c=34JDzuhY4Nlt5sHonFWh8ZAiUdHyybCCv44BhNtzvEw=",
                "https://media.istockphoto.com/id/841837302/photo/fishing.jpg?s=612x612&w=0&k=20&c=Fge9dv6z5JA6r_dKSdKPQNpgm9geb7O58N8xAs8ZGYo=",
                "https://media.istockphoto.com/id/1322104405/photo/father-and-son-fishing-together-at-the-lake.jpg?s=612x612&w=0&k=20&c=B6z3DZXUzb4R47z0d4Sj5ijICnDXCORU0vJhWh9ci4o="
            ],
            "activitySignupStartTime": "2024-05-17T06:39:19.740Z",
            "activitySignupEndTime": "2024-06-15T06:39:19.740Z",
            "activityStartTime": "2024-06-26T00:00:00.537Z",
            "activityEndTime": "2024-07-21T10:00:00.000Z",
            "bookedCapacity": 2,
            "likeCount": 2,
            "organizerRating": 5,
            "organizerName": "拼圖戶外生活",
            "organizerId": "664caee7ae10d7e7604c4feb"
        }
    ],
    "message": "取得成功",
    "pageInfo": {
        "hasNextPage": true,
        "hasPrevPage": false,
        "startCursor": "5_664cb717ae8e74de4ae74872",
        "endCursor": "5_664cb717ae8e74de4ae74872"
    }
}
    }
  */
);

// 跟團仔角度-取得活動詳細資料
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
            "rating": 4,
            "name":"XXX"
          },
          "isLiked": true,
          "likeCount":0
        },
        "message": "取得成功"
      }
    }
  */
);
export default router;
