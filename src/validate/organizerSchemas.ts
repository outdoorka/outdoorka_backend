import { type TypeOf, object, z } from 'zod';
import { HttpUrl, MobileTW, Password } from '../utils/regexs';

export const ogRegistrationSchema = z.object({
  body: object({
    name: z.string().min(2, '最少2個字').max(20, '最多20個字'),
    nickName: z.string().min(2, '最少2個字').max(20, '最多20個字'),
    email: z
      .string({
        required_error: '請輸入 Email'
      })
      .email('請輸入正確的 Email 格式'),
    mobile: z.string().regex(MobileTW, '請輸入正確的手機號碼'),
    profileDetail: z.string().max(100, '最多100個字').optional(),
    profileTags: z.array(z.string(), { message: '須為字串陣列' }).optional(),
    area: z.string().max(20).optional(),
    photo: z
      .string()
      .optional()
      .refine((photo) => {
        if (!photo) return true;
        return HttpUrl.test(photo);
      }, '請輸入正確圖片網址'),
    password: z.string().regex(Password, {
      message: '密碼必須為 8-20 位英數字混合，且至少包含一個大寫字母、一個小寫字母和一個數字'
    })
  })
});

export const ogLoginSchema = z.object({
  body: object({
    email: z
      .string({
        required_error: '請輸入 Email'
      })
      .email('請輸入正確的 Email 格式'),
    password: z.string().regex(Password, {
      message: '密碼必須為 8-20 位英數字混合，且至少包含一個大寫字母、一個小寫字母和一個數字'
    })
  })
});

export type OgAuthRegisterInput = TypeOf<typeof ogRegistrationSchema>['body'];
export type OgLoginInput = TypeOf<typeof ogLoginSchema>['body'];
