import express from 'express';
import { ticketController } from '../controllers';
import { handleErrorAsync } from '../services/handleResponse';
import { isOgAuth, isAuth } from '../services/handleAuth';
import { validateBody } from '../middleware/validationMiddleware';
import { updateTicketInfoSchema } from '../validate/ticketSchemas';
import { createRatingSchema } from '../validate/ratingSchemas';
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
  handleErrorAsync(ticketController.ticketConfirm)
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

// 跟團仔取得活動票券列表
router.get(
  '/',
  isAuth,
  handleErrorAsync(ticketController.getOwnerTicketList)
  /**
    #swagger.tags = ['Ticket']
    #swagger.description = '跟團仔取得活動票券列表'
    #swagger.security = [{ 'bearerAuth': [] }]
    #swagger.responses[200] = {
      description: '跟團仔取得活動票券列表，ticketTotal：此訂單票卷數量，ticketAssign：待分票票卷數量，包含自己的，ticketUse：已使用票卷數量，ticketStatu：自己的票卷使用狀況，0未使用>0已使用',
      schema:{
        "data": [
          {
            "title": "娛樂，悠遊玩水趣",
            "subtitle": "池上大坡池水上娛樂，悠遊玩水趣",
            "bookedCapacity": 2,
            "region": "南部",
            "city": "臺東縣",
            "activityImageUrl": "https://media.istockphoto.com/id/1071632168/photo/happy-family-kayak-walking-sunset-sea-island.webp?b=1&s=170667a&w=0&k=20&c=oCziJF4r4oEPkDZS64itjf5Ymj08YMs44WVjWWaoRco=",
            "activityStartTime": "2024-07-27T00:00:00.537Z",
            "activityEndTime": "2024-08-02T10:00:00.000Z",
            "activityExpired": false,
            "paymentId": "666ae9e583090862d4bc0a49",
            "paymentBuyer": "66501456b53ce982332ef69a",
            "ticketTotal": 3,
            "ticketAssign": 1,
            "ticketUse": 1,
            "ticketStatu": 1
          },
          {
            "title": "新手釣魚團-北海岸淺水灣紅燈防波堤釣點",
            "subtitle": "新手釣魚團-北海岸淺水灣紅燈防波堤釣點",
            "bookedCapacity": 2,
            "region": "北部",
            "city": "新北市",
            "activityImageUrl": "https://media.istockphoto.com/id/1367438696/photo/cute-redhead-boy-and-grandfather-fishing-in-the-river-in-quebec.jpg?s=612x612&w=0&k=20&c=34JDzuhY4Nlt5sHonFWh8ZAiUdHyybCCv44BhNtzvEw=",
            "activityStartTime": "2024-07-20T00:00:00.537Z",
            "activityEndTime": "2024-08-02T10:00:00.000Z",
            "activityExpired": false,
            "paymentId": "666af51583090862d4bc0a6b",
            "paymentBuyer": "6665ae57bdc4011bb2345c73",
            "ticketTotal": 1,
            "ticketAssign": 0,
            "ticketUse": 1,
            "ticketStatu": 1
          }
        ]
      }
    }
    #swagger.responses[404] = {
      description: '找不到票券',
      schema: {
        'errorMessage': '找不到票券',
        'errorCode': 'NOT_FOUND_TICKET',
      }
    }
  */
);

// 跟團仔取得待處理活動票券數量
router.get(
  '/suspense',
  isAuth,
  handleErrorAsync(ticketController.getUnusedTicketCount)
  /**
    #swagger.tags = ['Ticket']
    #swagger.description = '跟團仔取得待處理(未使用)活動票券數量'
    #swagger.security = [{ 'bearerAuth': [] }]
    #swagger.responses[200] = {
      description: '跟團仔取得待處理(未使用)活動票券數量',
      schema: {
        'data': [{
          "paymentId": "666af51583090862d4bc0a6b",
          "tickets": [
            {
              "ticketId": "666c57ab83090862d4bc0a9f",
              "ticketStatus": 1
            }
          ],
          "unused": 0
        }]
      }
    }
    #swagger.responses[404] = {
      description: '找不到待處理的票券',
      schema: {
        "errorMessage": "找不到待處理的票券",
        "errorCode": "NOT_FOUND_SUSPENSE_TICKET",
      }
    }
  */
);

// 用戶取得活動票券詳情
router.get(
  '/:id',
  isAuth,
  handleErrorAsync(ticketController.getOwnerTicketInfo)
  /**
    #swagger.tags = ['Ticket']
    #swagger.description = '用戶取得活動票券詳情'
    #swagger.security = [{ 'bearerAuth': [] }]
    #swagger.responses[200] = {
      description: '用戶取得活動票券詳情',
      schema: {
        "data": [
          {
            "_id": "666ae9e583090862d4bc0a49",
            "title": "娛樂，悠遊玩水趣",
            "subtitle": "池上大坡池水上娛樂，悠遊玩水趣",
            "region": "南部",
            "city": "臺東縣",
            "price": 600,
            "activityImageUrl": "https://media.istockphoto.com/id/1071632168/photo/happy-family-kayak-walking-sunset-sea-island.webp?b=1&s=170667a&w=0&k=20&c=oCziJF4r4oEPkDZS64itjf5Ymj08YMs44WVjWWaoRco=",
            "activityStartTime": "2024-07-27T00:00:00.537Z",
            "activityEndTime": "2024-08-02T10:00:00.000Z",
            "activityNotice": "activityNotice 最多200個字",
            "activityExpired": false,
            "organizer": {
              "_id": "664cb717ae8e74de4ae74871",
              "name": "拼圖戶外生活",
              "photo": "https://static.accupass.com/org/2005260527172844358540.jpg",
              "rating": 5,
              "mobile": "0911000001",
              "email": "email1@gmail.com"
            },
            "tickets": [
              {
                "ticketId": "666aeace83090862d4bc0a4d",
                "ticketStatus": 1,
                "ticketNote": "測試資料1-2",
                "ownerId": "66501456b53ce982332ef69a",
                "ownerName": "ingriD1234",
                "assignedAt": null
              },
              {
                "ticketId": "666af54f83090862d4bc0a72",
                "ticketStatus": 0,
                "ticketNote": "測試資料1-3-1",
                "ownerId": "66501456b53ce982332ef69a",
                "ownerName": "ingriD1234",
                "assignedAt": null
              }
            ],
            "ratingList": [
              "666aeace83090862d4bc0a4d",
              "666c57ab83090862d4bc0a9f"
            ]
          }
        ]
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

// 用戶分票或修改票券備註
router.patch(
  '/:id',
  isAuth,
  validateBody(updateTicketInfoSchema),
  handleErrorAsync(ticketController.updateTicketInfo)
  /**
    #swagger.tags = ['Ticket']
    #swagger.description = '用戶分票或修改票券備註'
    #swagger.security = [{ 'bearerAuth': [] }]
    #swagger.parameters = {
      name: 'body',
      in: 'body',
      description: '用戶分票或修改票券備註(ownerEmail, ticketNote二擇一)',
      required: true,
      schema: {
        ownerEmail: 'email1@gmail.com',
        ticketNote: '備註為最多 100 個字'
      }
    }
    #swagger.responses[200] = {
      description: '用戶分票或修改票券備註',
      schema: {
          "data": {
              "_id": "XXXXXXXXXXXXXXXXXXXXXXXX",
              "organizer": "XXXXXXXXXXXXXXXXXXXXXXXX",
              "activity": "XXXXXXXXXXXXXXXXXXXXXXXX",
              "payment": "XXXXXXXXXXXXXXXXXXXXXXXX",
              "owner": "XXXXXXXXXXXXXXXXXXXXXXXX",
              "ticketStatus": 0,
              "ticketCreatedAt": "2024-06-21T12:32:27.634Z",
              "ticketAssignedAt":"2024-06-21T12:34:27.634Z",
              "ticketNote": "備註為最多 100 個字",
              "ticketNoteUpdatedAt": "2024-06-23T16:59:23.760Z",
              "createdAt": "2024-06-21T12:32:27.635Z",
              "updatedAt": "2024-06-23T16:59:23.761Z"
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

// 使用者角度-評論主揪
router.post(
  '/:id/rating',
  isAuth,
  validateBody(createRatingSchema),
  handleErrorAsync(ticketController.createRating)
  /**
   * #swagger.tags = ["Review"]
   * #swagger.security = [{ "bearerAuth": [] }]
   * #swagger.description = "使用者角度-評論主揪"
   * #swagger.parameters["post"] = {
        in: "body",
        description: "使用者角度-評論主揪",
        required: true,
        schema: {
          rating: 5,
          comment: "comment 最多200個字"
        }
      }
   */
  /*
    #swagger.responses[200] = {
      description: "建立成功回應",
      schema: {
        "data": {
            "rating": 5,
            "comment": "comment 最多200個字",
            "organizerId": "XXXXXXXXXXXXXXXXXXXXXXXX",
            "activityId": "XXXXXXXXXXXXXXXXXXXXXXXX",
            "ticketId": "XXXXXXXXXXXXXXXXXXXXXXXX",
            "userId": "XXXXXXXXXXXXXXXXXXXXXXXX",
            "_id": "XXXXXXXXXXXXXXXXXXXXXXXX",
            "createdAt": "2024-06-24T16:22:33.333Z",
            "updatedAt": "2024-06-24T16:22:33.333Z"
        },
        "message": "建立成功"
    }
    }
  */
);

export default router;
