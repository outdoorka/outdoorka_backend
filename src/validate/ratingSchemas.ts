import { z, object } from 'zod';

export const createRatingSchema = z.object({
  body: object({
    rating: z.number().int().min(1).max(5).positive(),
    comment: z.string().max(200, '評論為最多 200 個字').optional()
  })
});
