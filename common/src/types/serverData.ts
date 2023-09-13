// 服务端数据库定义

import { z } from 'zod';
import { getDefaultSettings, linkerSchema, settingsSchema } from './entities';
import { defaultPassword } from '../utils/app';

const authSchema = z.object({
  adminPassword: z.string(),
  tokens: z.array(
    z.object({
      token: z.string(),
      expiresAt: z.number(),
      type: z.union([z.literal('guest'), z.literal('admin')]),
    })
  ),
});

export const dataSchema = z.object({
  linkers: z.array(linkerSchema),
  settings: settingsSchema,
  auth: authSchema,
});

export type Data = z.infer<typeof dataSchema>;
export const defaultData = dataSchema.parse({
  linkers: [],
  settings: getDefaultSettings(),
  auth: {
    adminPassword: defaultPassword,
    tokens: [],
  },
});
