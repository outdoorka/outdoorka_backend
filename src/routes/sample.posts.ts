import express from 'express';
import { postSampleController } from '../controllers';
import { handleErrorAsync } from '../services/handleResponse';

const router = express.Router();

// 取得全部文章
router.get(
  '/',
  /**
   * #swagger.tags = ['SamplePost']
   * #swagger.description = '取得所有 Posts 文章'
   * #swagger.parameters['timeSort'] = {
        in: 'query',
        description: '排序 asc, desc',
        required: false
      }
    #swagger.parameters['content'] = {
        in: 'query',
        description: '搜尋內容',
        required: false
      }
   */
  /* #swagger.responses[200] = {
      description: '取得所有文章',
      schema: {
        "data": [{
          "_id": "xxxxxxxxxxxxxxxxxxxx",
          "user": "xxxxxxxxxxxxx",
          "title": "title",
          "content": "content",
          "tag": [
            "教學"
          ],
          "image": "https://placehold.co/600x400",
          "likes": 0,
          "comments": 0,
          "isPublic": true,
          "createdAt": "2024-04-17T03:59:21.350Z",
          "updatedAt": "2024-04-24T16:18:34.032Z"
        }]
      }
  } */
  handleErrorAsync(postSampleController.getPosts)
);

// 新增文章
router.post(
  '/',
  /**
   * #swagger.tags = ['SamplePost']
   * #swagger.description = '新增 Post 文章'
      #swagger.parameters['post'] = {
        in: 'body',
        description: '新增文章',
        required: true,
        schema: {
          $user: 'xxxxxxxxxxxxxxxxxxxx',
          $title: 'title',
          $content: 'content',
          $tag: ['教學'],
          image: 'https://placehold.co/600x400',
          isPublic: true
        }
      }
      #swagger.security = [{
        "JWT": []
      }]
   */
  handleErrorAsync(postSampleController.createPost)
);

// 更新文章
router.patch(
  '/:id',
  /**
   * #swagger.tags = ['SamplePost']
   * #swagger.description = '修改 Post 文章'
      #swagger.parameters['patch'] = {
        in: 'body',
        description: '修改文章',
        required: true,
        schema: {
          $title: 'title',
          $content: 'content'
        }
      }
      #swagger.security = [{
        "JWT": []
      }]
   */
  handleErrorAsync(postSampleController.updatePost)
);

// 刪除文章
router.delete(
  '/:id',
  /**
   * #swagger.tags = ['SamplePost']
   * #swagger.description = '刪除 Post 文章'
      #swagger.security = [{
        "JWT": []
      }]
   */
  handleErrorAsync(postSampleController.deletePost)
);

export default router;
