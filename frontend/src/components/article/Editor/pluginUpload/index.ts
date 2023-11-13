import type { BytemdEditorContext, BytemdPlugin } from 'bytemd';
import { icons } from './icons';
import ZH from './locales/zh_Hans.json';
import selectFiles from 'select-files';

type UploadedFilesInfo = {
  title: string;
  url: string;
  isImage?: boolean;
}[];
export type UploadFile = (files: File[]) => Promise<UploadedFilesInfo>;

interface BytemdPluginUploadFileOptions {
  locale?: Partial<typeof ZH>;
  uploadFiles?: UploadFile;
}

export default function UploadFile({
  locale: _locale,
  uploadFiles = async (files) =>
    files.map((t) => {
      return {
        title: t.name,
        url: URL.createObjectURL(t),
        isImage: t.type.startsWith('image'),
      };
    }),
}: BytemdPluginUploadFileOptions = {}): BytemdPlugin {
  const locale = { ...ZH, ..._locale } as typeof ZH;
  const appendFiles = (ctx: BytemdEditorContext, files: UploadedFilesInfo) => {
    const pos = ctx.appendBlock(
      files
        .map(({ url, title, isImage }) => {
          return `${isImage ? '!' : ''}[${title}](${url})`;
        })
        .join('\n\n')
    );
    ctx.editor.setSelection(
      pos,
      ctx.codemirror.Pos(pos.line + files.length * 2 - 2)
    );
    ctx.editor.focus();
  };
  return {
    actions: [
      {
        title: locale.uploadFile,
        icon: icons.uploadFile,
        handler: {
          type: 'action',
          async click(ctx) {
            const fileList = await selectFiles({
              accept: '*',
              multiple: true,
            });
            if (fileList?.length) {
              const files = await uploadFiles(Array.from(fileList));
              appendFiles(ctx, files);
            }
          },
        },
      },
    ],
    editorEffect(ctx) {
      const el = ctx.editor.getWrapperElement();
      const handlePaste = async (e: ClipboardEvent) => {
        if (e.clipboardData?.files?.length) {
          e.preventDefault();
          const fileList = await uploadFiles(Array.from(e.clipboardData.files));
          appendFiles(ctx, fileList);
        }
      };
      const handleDrop = async (e: DragEvent) => {
        if (e.dataTransfer?.files?.length) {
          e.preventDefault();
          const fileList = await uploadFiles(Array.from(e.dataTransfer.files));
          appendFiles(ctx, fileList);
        }
      };
      el.addEventListener('paste', handlePaste);
      el.addEventListener('drop', handleDrop);
      return () => {
        el.removeEventListener('paste', handlePaste);
        el.removeEventListener('drop', handleDrop);
      };
    },
  };
}
