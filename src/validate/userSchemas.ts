import { type TypeOf, z, object } from 'zod';
import { HttpUrl, MobileTW, Password } from '../utils/regexs';

export const userUpdateSchema = z.object({
  body: object({
    name: z.string().min(2, '名稱最少2個字').max(20, '最多20個字'),
    mobile: z.string().regex(MobileTW, '請輸入正確的手機號碼'),
    photo: z
      .string()
      .optional()
      .refine((photo) => {
        if (!photo) return true;
        return HttpUrl.test(photo);
      }, '請輸入正確圖片網址'),
    gender: z.string().optional(),
    birthday: z.string().optional()
  })
});

export const userUpdateEmailSchema = z.object({
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

export const userUpdatePwdSchema = z.object({
  body: object({
    password: z.string().regex(Password, {
      message: '密碼必須為 8-20 位英數字混合，且至少包含一個大寫字母、一個小寫字母和一個數字'
    }),
    newPassword: z.string().regex(Password, {
      message: '密碼必須為 8-20 位英數字混合，且至少包含一個大寫字母、一個小寫字母和一個數字'
    }),
    confirmPassword: z.string().regex(Password, {
      message: '密碼必須為 8-20 位英數字混合，且至少包含一個大寫字母、一個小寫字母和一個數字'
    })
  })
});

export type UserUpdateInput = TypeOf<typeof userUpdateSchema>['body'];
export type UserUpdateEmailInput = TypeOf<typeof userUpdateEmailSchema>['body'];
export type UserUpdatePwdInput = TypeOf<typeof userUpdatePwdSchema>['body'];
