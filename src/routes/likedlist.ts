import express from 'express';
import { likedListController } from '../controllers';
import { handleErrorAsync } from '../services/handleResponse';
import { isAuth } from '../services/handleAuth';
const router = express.Router();

// 跟團仔取得收藏活動清單
router.get(
  '/',
  isAuth,
  handleErrorAsync(likedListController.getlikedListData)
  /**
   * #swagger.tags = ['Like-List']
   * #swagger.description = '跟團仔取得收藏活動清單 '
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  /*

  #swagger.responses[200] = {
      description: '跟團仔取得收藏活動清單',
      schema: {
        	"data":{
              "activityTags": [
                "fishing",
                "Hiking",
                "Camping"
              ],
              "region": [
                "中部",
                "北部",
                "南部"
              ],
              "likedList": [
                {
                  "_id": "664cb717ae8e74de4ae74872",
                  "organizer": {
                    "_id": "664ca866ae10d7e7604c4fe7",
                    "email": "email2@gmail.com",
                    "photo": "https://static.accupass.com/org/2304041722089876493900.jpg",
                    "rating": 4
                  },
                  "subtitle": "新手釣魚團-北海岸淺水灣紅燈防波堤釣點",
                  "region": "北部",
                  "city": "新北市",
                  "activityImageUrls": [
                        "XXX",
                        "XXX",
                        "XXX"
                  ],
                  "activityStartTime": "2024-07-20T00:00:00.537Z",
                  "activityEndTime": "2024-07-21T10:00:00.000Z",
                  "bookedCapacity": 2
                },
                {
                  "_id": "664cb717ae8e74de4ae74875",
                  "organizer": {
                    "_id": "664caee7ae10d7e7604c4feb",
                    "email": "email1@gmail.com",
                    "photo": "https://static.accupass.com/org/2005260527172844358540.jpg",
                    "rating": 5
                  },
                  "subtitle": "嘉明湖 天使的眼淚",
                  "region": "南部",
                  "city": "臺東縣",
                  "activityImageUrls": [
                        "XXX",
                        "XXX",
                        "XXX"
                  ],
                  "activityStartTime": "2024-07-07T00:00:00.537Z",
                  "activityEndTime": "2024-07-07T10:00:00.000Z",
                  "bookedCapacity": 8
                }
              ]
            },
        },
        "message": "取得成功"
      }
    }

  #swagger.responses[20 0] = {
      description: '沒有收藏活動',
      schema: {
        	"data":{
          "activityTags": [],
          "region": [],
          "likedList": []
        },
        "message": "取得成功"
      }
    }
  */
);
// 跟團仔把活動加入收藏
router.post(
  '/:activityID',
  isAuth,
  handleErrorAsync(likedListController.addlikedList)
  /**
   * #swagger.tags = ['Like-List']
   * #swagger.description = '跟團仔把活動加入收藏 '
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  /*
#swagger.responses[200] = {
      description: '活動加入收藏成功',
      schema: {
        "data": {},
        "message": "活動加入收藏成功"
      }
    }
  #swagger.responses[409] = {
      description: '活動已加入收藏',
      schema: {
         "errorMessage": "活動已加入收藏",
         "errorCode": "ACTIVITY_ALREADY_ADD",
      }
    }
  */
);

// 跟團仔把活動移除收藏
router.delete(
  '/:activityID',
  isAuth,
  handleErrorAsync(likedListController.removelikedList)
  /**
   * #swagger.tags = ['Like-List']
   * #swagger.description = '跟團仔把活動移除收藏 '
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  /*
#swagger.responses[200] = {
      description: '活動移除收藏成功',
      schema: {
        "data": {},
        "message": "活動移除收藏成功"
      }
    }
  #swagger.responses[404] = {
      description: '用戶未收藏该活動',
      schema: {
         "errorMessage": "用戶未收藏该活動",
         "errorCode": "NOT_FOUND_LIKE_LIST",
      }
    }
  */
);
export default router;
