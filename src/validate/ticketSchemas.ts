import { type TypeOf, z, object } from 'zod';

export const updateTicketInfoSchema = z.object({
  body: object({
    ownerEmail: z.string().email('請輸入正確的 Email 格式').optional(),
    ticketNote: z.string().max(100, '備註為最多 100 個字').optional()
  })
});

export type UpdateTicketInfoSchema = TypeOf<typeof updateTicketInfoSchema>['body'];
