import { handleResponse, handleAppError } from '../services/handleResponse';
import { PostSample } from '../models';
import { isString } from '../utils/helpers';

import type { NextFunction, Request, Response } from 'express';
import type { IPostModel } from '../types/dto/sample.post';
import type { FilterQuery } from 'mongoose';

export const postSampleController = {
  // 取得全部文章
  async getPosts(req: Request, res: Response) {
    // asc 遞增(由小到大，由舊到新) : 1,  desc 遞減(由大到小、由新到舊) : -1
    const timeSort = req.query.timeSort === 'asc' ? 1 : -1;
    // 搜尋內容
    const q: FilterQuery<IPostModel> =
      req.query.q !== undefined ? { content: new RegExp(String(req.query.q)) } : {};

    const posts = await PostSample.find(q)
      .populate({
        path: 'user likes', // user likes 欄位
        select: 'name photo'
      })
      .sort({ createdAt: timeSort })
      .lean();

    handleResponse(res, posts, '取得成功');
  },

  // 新增文章
  async createPost(req: Request, res: Response, next: NextFunction) {
    const { body } = req as { body: IPostModel };
    const { user, title, content, image, tag } = body;

    if (isString(title) && title.trim() && isString(content) && content.trim() && isString(image)) {
      const postData: IPostModel = {
        title: title.trim(),
        content: content.trim(),
        user,
        tag: tag || [],
        image: image?.trim() || '',
        likes: [],
        comments: 0,
        isPublic: body.isPublic || false
      };
      const newPost = await PostSample.create(postData);

      handleResponse(res, newPost, '新增成功');
      return;
    }

    handleAppError(400, '請確認欄位是否填寫完整', next);
  },

  // 更新文章
  async updatePost(req: Request, res: Response, next: NextFunction) {
    const _id = req.params.id;
    const { body } = req as { body: IPostModel };
    const { title, content, likes } = body;
    if (isString(title) && title.trim() && isString(content) && content.trim()) {
      const postData = {
        title: body.title.trim(),
        content: body.content.trim(),
        likes: likes || []
      };

      const result = await PostSample.findByIdAndUpdate(_id, postData, {
        new: true
      });

      if (!result) {
        handleAppError(400, '更新失敗，找不到文章', next);
        return;
      }

      handleResponse(res, result, '更新成功');
      return;
    }

    handleAppError(400, '請確認欄位是否填寫完整', next);
  },

  // 刪除文章
  async deletePost(req: Request, res: Response, next: NextFunction) {
    const _id = req.params.id;
    const checkId = await PostSample.findById(_id);

    if (!checkId) {
      handleAppError(404, '找不到此文章', next);
      return;
    }

    await PostSample.findByIdAndDelete(_id);
    handleResponse(res, [], '刪除成功');
  }
};
