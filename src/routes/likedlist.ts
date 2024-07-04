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
                  "_id": "664cb717ae8e74de4ae74875",
                  "organizer": {
                    "_id": "664caee7ae10d7e7604c4feb",
                    "email": "email1@gmail.com",
                    "photo": "https://static.accupass.com/org/2005260527172844358540.jpg",
                    "rating": 5
                  },
                  "title": "嘉明湖 天使的眼淚",
                  "subtitle": "嘉明湖 天使的眼淚",
                   "activityTags": "Camping",
                  "region": "南部",
                  "city": "臺東縣",
                  "activityImageUrls": [
                        "XXX",
                        "XXX",
                        "XXX"
                  ],
                  "activityStartTime": "2024-07-07T00:00:00.537Z",
                  "activityEndTime": "2024-07-07T10:00:00.000Z",
                  "bookedCapacity": 8,
                  "likeCount": 1
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

// 跟團仔取得收藏活動清單
router.get(
  '/showID',
  isAuth,
  handleErrorAsync(likedListController.getlikedListID)
  /**
   * #swagger.tags = ['Like-List']
   * #swagger.description = '跟團仔取得收藏活動清單_只顯示活動ID '
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  /*

  #swagger.responses[200] = {
      description: '跟團仔取得收藏活動清單',
      schema: {
              "data": [
                {
                  "_id": "664cb717ae8e74de4ae74875"
                }
              ],
              "message": "取得成功"
            }
    }

  #swagger.responses[20 0] = {
      description: '沒有收藏活動',
      schema: {
        	"data":[],
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
