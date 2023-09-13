// 实体类型定义

import { now } from 'lodash';
import { nanoid } from 'nanoid';
import { z } from 'zod';

// Link条目
export const linkerSchema = z.object({
  id: z.string(),

  name: z.string(), // 名字
  desc: z.string(), // 描述
  url: z.string(), // 链接
  icon: z.string(), // 图标
  tags: z.array(z.string()), // 标签

  article: z.boolean(), // 是否是文章
  content: z.string(), // 内容（文章专用）

  accessAt: z.number(), // 访问时间
  createdAt: z.number(), // 创建时间
  updatedAt: z.number(), // 修改时间
  accessCount: z.number(), // 访问次数
  pin: z.boolean(), // 设置为置顶
});

export type Linker = z.infer<typeof linkerSchema>;

// 系统设置

export const settingsSchema = z.object({
  // 网址解析服务，可留空，必须是一个网址
  htmlParseServer: z.union([z.string().url(), z.literal('')]),
  // 网址解析服务请求超时时间，单位：秒
  htmlParseTimeoutSeconds: z.number().int().min(1).max(20),
  // 搜索引擎配置，可留空，搜索地址必须包含TEXT占位符，如 "https://www.baidu.com/s?wd=TEXT"
  searchUrl: z.union([z.string().url().includes('TEXT'), z.literal('')]),
  // 当前的自定义壁纸
  customWallpaperUrl: z.string(),
  // 所有的自定义壁纸
  customWallpapers: z.array(z.string()),
  // 壁纸类型
  wallpaperType: z.enum(['bing', 'custom']),
  // 语言类型
  langType: z.enum(['zh', 'en']),
});
export type Settings = z.infer<typeof settingsSchema>;

export function getDefaultSettings(): Settings {
  return {
    htmlParseServer: '',
    htmlParseTimeoutSeconds: 5,
    searchUrl: '',
    customWallpaperUrl: '/backgrounds/bg5.jpg',
    customWallpapers: [
      '/backgrounds/bg1.jpeg',
      '/backgrounds/bg2.jpg',
      '/backgrounds/bg3.png',
      '/backgrounds/bg4.png',
      '/backgrounds/bg5.jpg',
    ],
    wallpaperType: 'custom',
    langType: 'zh',
  };
}

export function getNewLinker(): Linker {
  return {
    id: nanoid(),
    name: '',
    desc: '',
    url: '',
    icon: '',
    tags: [],
    article: false,
    content: '',
    accessAt: 0,
    createdAt: now(),
    updatedAt: now(),
    accessCount: 0,
    pin: false,
  };
}
