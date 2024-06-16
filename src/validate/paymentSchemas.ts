import { z, object } from 'zod';
import { MobileTW } from '../utils/regexs';
import { Types } from 'mongoose';

export const createPaymentSchema = z.object({
  body: object({
    activityId: z
      .string()
      .refine((value) => Types.ObjectId.isValid(value), '請輸入有效的 ObjectId'),
    ticketCount: z.number().int().positive('請輸入正整數'),
    buyerName: z.string().min(2, '最少2個字').max(20, '最多20個字'),
    buyerEmail: z
      .string({
        required_error: '請輸入 Email'
      })
      .email('請輸入正確的 Email 格式'),
    buyerMobile: z.string().regex(MobileTW, '請輸入正確的手機號碼')
  })
});
