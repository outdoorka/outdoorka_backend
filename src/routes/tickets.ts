import express from 'express';
import { ticketController } from '../controllers';
import { handleErrorAsync } from '../services/handleResponse';
import { isOgAuth, isAuth } from '../services/handleAuth';

const router = express.Router();

// 主揪取得活動票券資訊 (掃描後顯示活動待確認畫面)
router.get(
  '/:id/confirm',
  isOgAuth,
  handleErrorAsync(ticketController.getTicketData)
  /**
   * #swagger.tags = ['Ticket']
   * #swagger.description = '主揪取得活動票券資訊 '
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  /*
  #swagger.responses[200] = {
      description: '主揪取得活動票券資訊',
      schema: {
  "data": {
    "_id": "6661c20a2fc7bac3ef9ff823",
    "ticketStatus": 0,
    "ticketNote": "測試資料",
    "activity": {
      "_id": "664cb717ae8e74de4ae74871",
      "title": "池上大坡池水上娛樂，悠遊玩水趣",
      "subtitle": "池上大坡池水上娛樂，悠遊玩水趣",
      "price": 600,
      "activityImageUrls": [
            "xxxx",
            "xxxx",
            "xxxx"
      ],
      "activityStartTime": "2024-07-27T00:00:00.537Z",
      "activityEndTime": "2024-07-27T10:00:00.000Z"
    },
    "owner": {
      "_id": "6650ad94a723374e4c105f9f",
      "name": "name",
      "mobile": "0911000000"
    }
  },
  "message": "取得成功"
}

    }
  #swagger.responses[404] = {
      description: '找不到票券',
      schema: {
         "errorMessage": "找不到票券",
         "errorCode": "NOT_FOUND_TICKET",
      }
    }
  */
);

// 活動驗票，主揪做確認報到動作
router.patch(
  '/:id/confirm',
  isOgAuth,
  handleErrorAsync(ticketController.ticketComfirm)
  /**
   * #swagger.tags = ['Ticket']
   * #swagger.description = '活動驗票，主揪做確認報到動作 '
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  /*
  #swagger.responses[200] = {
      description: '主揪驗票成功',
      schema: {
        "data": {
                  "ticketStatus": 1
        },
        "message": "驗票成功"
      }

    }
  #swagger.responses[400] = {
      description: '票券已確認報到',
      schema: {
         "errorMessage": "票券已確認報到",
         "errorCode": "TICKET_USED",
      }
    }
  #swagger.responses[404] = {
      description: '找不到票券',
      schema: {
         "errorMessage": "找不到票券",
         "errorCode": "NOT_FOUND_TICKET",
      }
    }
  */
);

// 用戶取得活動票券列表
router.get(
  '/',
  isAuth,
  handleErrorAsync(ticketController.getOwnerTicketData)
  /**
    #swagger.tags = ['Ticket']
    #swagger.description = '用戶取得活動票券列表'
    #swagger.security = [{ 'bearerAuth': [] }]
    #swagger.responses[200] = {
      description: '用戶取得活動票券列表',
      schema: {
        'data': [{
          '_id': '6661c20a2fc7bac3ef9ff823',
          'ticketStatus': 0,
          'ticketNote': '測試資料',
          'activity': {
            '_id': '664cb717ae8e74de4ae74871',
            'title': '池上大坡池水上娛樂，悠遊玩水趣',
            'subtitle': '池上大坡池水上娛樂，悠遊玩水趣',
            'price': 600,
            'activityImageUrls': ['xxxx','xxxx','xxxx'],
            'activityStartTime': '2024-07-27T00:00:00.537Z',
            'activityEndTime': '2024-07-27T10:00:00.000Z'
          },
          'owner': {
            '_id': '6650ad94a723374e4c105f9f',
            'name': 'name',
            'mobile': '0911000000'
          }
        }]
      }
    }
    #swagger.responses[404] = {
      description: '找不到票券',
      schema: {
        "errorMessage": "找不到票券",
        "errorCode": "NOT_FOUND_TICKET",
      }
    }
  */
);
export default router;
