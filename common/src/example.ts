import { z } from 'zod';

export const ExampleSchema = z.object({
  username: z.string().min(1).max(10),
  age: z.number().min(1),
});

export type Example = z.infer<typeof ExampleSchema>;
