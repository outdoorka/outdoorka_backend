import { type TypeOf, z, object } from 'zod';

export const authorizeAccessSchema = z.object({
  body: object({
    id: z.string().min(6, '請輸入正確ID格式'),
    email: z
      .string({
        required_error: '請輸入 Email'
      })
      .email('請輸入正確的 Email 格式')
  })
});

export type AuthorizeAccessInput = TypeOf<typeof authorizeAccessSchema>['body'];
