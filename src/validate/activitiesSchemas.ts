import { ActivityTag, City } from '../types/enum/activity';
import { type TypeOf, z, object } from 'zod';

// 將 ActivityTag 的 enum 轉成 string[]，要確保 enum 的值都是 string 並有值
const activityEnumValue: string[] = Object.keys(ActivityTag);

export const createActivitySchema = z.object({
  body: object({
    title: z.string().min(2, 'title 為 2~100 個字').max(100, 'title 為 2~100 個字'),
    subtitle: z.string().max(100, 'subtitle 最多 100 個字'),
    price: z.number().int().positive('價格必須為正整數'),
    totalCapacity: z.number().int().positive('總人數必須為正整數'),
    city: z.nativeEnum(City),
    address: z.string().min(1, '活動地址為 2~100 個字').max(100, '活動地址為 2~100 個字'),
    location: z.string().min(2, '集合地點 為 2~100 個字').max(100, '集合地點 為 2~100 個字'),
    activityDetail: z.string().min(2, '活動介紹為 2~1000 個字').max(1000, '活動介紹為 2~1000 個字'),
    activityNotice: z.string().min(2, '注意事項為 2~200 個字').max(200, '注意事項為 2~200 個字'),
    activityTags: z.array(z.enum(activityEnumValue as [string, ...string[]]), {
      message: '須為字串陣列'
    }),
    activityLinks: z
      .array(
        z.object({
          name: z.string().max(50, '50'),
          url: z.string().url('請輸入正確的網址')
        }),
        { message: '須為物件陣列' }
      )
      .max(5, '最多5個相關連結'),
    activityImageUrls: z.array(z.string(), { message: '須為字串陣列' }).max(5, '最多5張圖片'),
    isPublish: z.boolean(),
    activitySignupStartTime: z.string().transform((val) => new Date(val)),
    activitySignupEndTime: z.string().transform((val) => new Date(val)),
    activityStartTime: z.string().transform((val) => new Date(val)),
    activityEndTime: z.string().transform((val) => new Date(val))
  })
});

export type CreateActivitySchemaInput = TypeOf<typeof createActivitySchema>['body'];
