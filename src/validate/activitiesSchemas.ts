import { HttpUrl } from '../utils/regexs';
import { ActivityTag, City, Region } from '../types/enum/activity';
import { type TypeOf, z, object } from 'zod';
import { Types } from 'mongoose';

// 將 ActivityTag 的 enum 轉成 string[]，要確保 enum 的值都是 string 並有值
const activityEnumValue: string[] = Object.keys(ActivityTag);
const regionEnumValue: string[] = Object.keys(Region);
const sortEnumValue = [
  'date_asc',
  'date_desc',
  'rating_asc',
  'rating_desc',
  'capacity_asc',
  'capacity_desc'
];

export const createActivitySchema = z.object({
  body: object({
    title: z.string().min(2, '活動主標題為 2~100 個字').max(100, 'title 為 2~100 個字'),
    subtitle: z.string().max(100, '活動副標題為最多 100 個字'),
    price: z.number().int().positive('價格必須為大於0'),
    totalCapacity: z.number().int().positive('總人數必須為大於0'),
    city: z.nativeEnum(City),
    address: z.string().min(1, '活動地址為 2~100 個字').max(100, '活動地址為 2~100 個字'),
    location: z.string().min(2, '集合地點為 2~100 個字').max(100, '集合地點 為 2~100 個字'),
    activityDetail: z.string().min(2, '活動介紹為 2~1000 個字').max(1000, '活動介紹為 2~1000 個字'),
    activityNotice: z.string().min(2, '注意事項為 2~200 個字').max(200, '注意事項為 2~200 個字'),
    activityTags: z
      .array(z.enum(activityEnumValue as [string, ...string[]]), {
        message: '須為字串陣列'
      })
      .min(1, '最少選擇一個活動標籤'),
    activityLinks: z
      .array(
        z.object({
          name: z.string().max(50, '50'),
          url: z.string().url('請輸入正確的網址')
        }),
        { message: '須為物件陣列' }
      )
      .max(5, '最多5個相關連結'),
    activityImageUrls: z
      .array(
        z.string().refine((photo) => {
          if (!photo) return true;
          return HttpUrl.test(photo);
        }, '請輸入正確圖片網址')
      )
      .min(1, '最少1張圖片')
      .max(5, '最多5張圖片'),
    isPublish: z.boolean(),
    activitySignupStartTime: z.string().transform((val) => new Date(val)),
    activitySignupEndTime: z.string().transform((val) => new Date(val)),
    activityStartTime: z.string().transform((val) => new Date(val)),
    activityEndTime: z.string().transform((val) => new Date(val))
  })
});

const defaultEndDate = new Date(new Date().setMonth(new Date().getMonth() + 1));

export const getActivityListSchema = z.object({
  query: object({
    perPage: z
      .string()
      .optional()
      .default('10')
      .transform((val) => Number(val))
      .refine((val) => Number.isInteger(val) && val > 0, {
        message: 'perPage must be a positive integer',
        path: ['perPage']
      }),
    cursor: z.string().optional().nullable(),
    // .transform((val) => (val ? new Types.ObjectId(val) : null)),
    direction: z.enum(['forward', 'backward']).optional().default('forward'),
    startTime: z
      .string()
      .optional()
      .default(() => new Date().toISOString())
      .transform((val) => new Date(val)),
    endTime: z
      .string()
      .optional()
      .default(() => defaultEndDate.toISOString())
      .transform((val) => new Date(val)),
    theme: z
      .string()
      .nullable()
      .optional()
      .transform((val) => (val ? val.split(',') : null))
      .refine(
        (val) =>
          val === null ||
          val.every((item) => activityEnumValue.includes(item), {
            message: `theme must be a item of: ${activityEnumValue.join(',')})`,
            path: ['theme']
          })
      ),
    region: z
      .string()
      .nullable()
      .optional()
      .transform((val) => (val ? val.split(',') : null))
      .refine((val) => val === null || val.every((item) => regionEnumValue.includes(item)), {
        message: `region must be a item of: ${regionEnumValue.join(',')})`,
        path: ['region']
      }),
    capacity: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : null))
      .refine((val) => val === null || [1, 2, 3, 4, 5].includes(val), {
        message: 'capacity must be in 1-5',
        path: ['capacity']
      }),
    organizerId: z
      .string()
      .optional()
      .nullable()
      .transform((val) => (val ? new Types.ObjectId(val) : null)),
    keyword: z
      .string()
      .optional()
      .nullable()
      .transform((val) => (val ? val.trim() : null)),
    sort: z
      .string()
      .optional()
      .default('date_asc')
      .refine((value) => sortEnumValue.includes(value), {
        message: `sort value must be one of: ${sortEnumValue.join(',')})`
      })
  })
});

export type CreateActivitySchemaInput = TypeOf<typeof createActivitySchema>['body'];
export type GetActivityListInput = TypeOf<typeof getActivityListSchema>['query'];
