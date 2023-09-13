import { z } from 'zod';

const siteSchema = z.object({
  name: z.string(),
  type: z.literal('site'),
  href: z.string(),
});

type Site = z.infer<typeof siteSchema>;

type Folder = {
  name: string;
  type: 'folder';
  children: Array<Folder | Site>;
};

const folderSchema: z.ZodType<Folder> = z.object({
  name: z.string(),
  type: z.literal('folder'),
  children: z.array(z.union([z.lazy(() => folderSchema), siteSchema])),
});

export const bookmarksSchema = z.array(
  z.union([z.lazy(() => folderSchema), siteSchema])
);

export type Bookmarks = z.infer<typeof bookmarksSchema>;
