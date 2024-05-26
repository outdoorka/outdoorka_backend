import express from 'express';
import { activityController } from '../controllers';
import { handleErrorAsync } from '../services/handleResponse';
import { validateBody } from '../middleware/validationMiddleware';
import { getActivityListSchema } from '../validate/activitiesSchemas';

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
// TODO: Need to add document-swagger.parameters['get']
router.get(
  '/list',
  validateBody(getActivityListSchema),
  /**
   * #swagger.tags = ['Activity']
   * #swagger.description = '取得活動列表清單'
   */
  /*
  #swagger.responses[200] = {
      description: '成功取得活動列表清單',
      schema:  {
        "data": [
            {
              "_id": "664cb717ae8e74de4ae74881",
              "organizer": "664caee7ae10d7e7604c4feb",
              "title": "【北部三大岩場】五寮尖┃山行旅",
              "subtitle": "【北部三大岩場】五寮尖┃山行旅",
              "price": 600,
              "totalCapacity": 20,
              "region": "北部",
              "city": "新北市",
              "address": "address 最多100個字",
              "location": "location 最多100個字",
              "activityDetail": "activityDetail 最多1000個字",
              "activityNotice": "activityNotice 最多200個字",
              "activityTags": [
                "Camping",
                "Hiking"
              ],
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
              "activityImageUrls": [
                "https://media.istockphoto.com/id/1341822177/photo/field-scenery-views-and-green-fields-on-a-clear-day.jpg?s=612x612&w=0&k=20&c=A36Y2l6NIAUs9dy9xeFsP3Y8nLmItGscoaC37lQmdyo=",
                "https://media.istockphoto.com/id/1161326079/photo/paddy-rice-field-plantation-landscape-with-mountain-view-background.jpg?s=612x612&w=0&k=20&c=AuOZfEoEeEriEbQYO5bfB1qd6OKlpbIcGMCP1tqOzyc=",
                "https://media.istockphoto.com/id/531993132/photo/landscape-of-longjing-tea-fields.jpg?s=612x612&w=0&k=20&c=eLoFr6JZjqg1ytkCy_lLjMlPog6SVkCiBqGoV6BL0xM="
              ],
              "isPublish": true,
              "activitySignupStartTime": "2024-06-30T00:00:00.537Z",
              "activitySignupEndTime": "2024-06-30T10:00:00.000Z",
              "activityStartTime": "2024-06-08T02:00:00.537Z",
              "activityEndTime": "2024-06-08T12:00:00.000Z",
              "likers": [
                [
                  "662e50040c6ea78849fae82f"
                ],
                [
                  "662e50040c6ea78849fae82f"
                ]
              ],
              "createdAt": "2024-05-22T07:47:44.839Z",
              "updatedAt": "2024-05-22T07:47:44.839Z",
              "bookedCapacity": 12
            },
            {
              "_id": "664cb717ae8e74de4ae74882",
              "organizer": "664ca866ae10d7e7604c4fe7",
              "title": "大屯溪古道上小觀音山｜戶外生活 X 山旅戶外",
              "subtitle": "大屯溪古道上小觀音山｜戶外生活 X 山旅戶外",
              "price": 600,
              "totalCapacity": 20,
              "region": "北部",
              "city": "新北市",
              "address": "address 最多100個字",
              "location": "location 最多100個字",
              "activityDetail": "activityDetail 最多1000個字",
              "activityNotice": "activityNotice 最多200個字",
              "activityTags": [
                "Camping",
                "Hiking"
              ],
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
              "activityImageUrls": [
                "https://media.istockphoto.com/id/891408558/photo/male-and-woman-couples-asia-travelers-travel-nature-forests-mountains-waterfalls.jpg?s=612x612&w=0&k=20&c=_lZBEwoNODR8NcgmLSvHTF79o6eQGNWY6dejpD9PvOs=",
                "https://media.istockphoto.com/id/648802984/photo/businessman-with-backpack-and-laptop-and-phone-at-waterfall-the-forest.jpg?s=612x612&w=0&k=20&c=73imKgvhulPgnskKTcwdKgnZueP07dmnj_u--JB0qyw=",
                "https://media.istockphoto.com/id/481072273/photo/rainforest.jpg?s=612x612&w=0&k=20&c=HK0t1fI4-LPgCQKzFeMpVW0LvwTn91Paq52c0HfE1OM="
              ],
              "isPublish": true,
              "activitySignupStartTime": "2024-05-05T00:00:00.537Z",
              "activitySignupEndTime": "2024-05-30T10:00:00.000Z",
              "activityStartTime": "2024-06-09T01:00:00.537Z",
              "activityEndTime": "2024-06-09T12:00:00.000Z",
              "likers": [
                [
                  "662e50040c6ea78849fae82f"
                ],
                [
                  "662e50040c6ea78849fae82f"
                ]
              ],
              "createdAt": "2024-05-22T07:47:44.839Z",
              "updatedAt": "2024-05-22T07:47:44.839Z",
              "bookedCapacity": 18
            }
          ]
        }
    }
  */
  handleErrorAsync(activityController.getActivityList)
);

export default router;
