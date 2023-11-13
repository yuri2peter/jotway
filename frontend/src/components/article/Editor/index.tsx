import { useState } from 'react';
import mainLocaleEn from 'bytemd/locales/en.json';
import mainLocaleZh from 'bytemd/locales/zh_Hans.json';
import { Editor } from '@bytemd/react';
import 'bytemd/dist/index.css';
import gfm from '@bytemd/plugin-gfm';
import gfmLocaleZh from '@bytemd/plugin-gfm/locales/zh_Hans.json';
import gfmLocaleEn from '@bytemd/plugin-gfm/locales/en.json';
import breaks from '@bytemd/plugin-breaks';
import frontmatter from '@bytemd/plugin-frontmatter';
import gemoji from '@bytemd/plugin-gemoji';
import highlight from '@bytemd/plugin-highlight';
import 'highlight.js/styles/default.css';
import math from '@bytemd/plugin-math';
import mathLocaleZh from '@bytemd/plugin-math/locales/zh_Hans.json';
import mathLocaleEn from '@bytemd/plugin-math/locales/en.json';
import 'katex/dist/katex.css';
import mediumZoom from '@bytemd/plugin-medium-zoom';
import mermaid from '@bytemd/plugin-mermaid';
import mermaidLocaleZh from '@bytemd/plugin-mermaid/locales/zh_Hans.json';
import mermaidLocaleEn from '@bytemd/plugin-mermaid/locales/en.json';
import uplaod from './pluginUpload';
import uplaodLocaleZh from './pluginUpload/locales/zh_Hans.json';
import uplaodLocaleEn from './pluginUpload/locales/en.json';
import './markdown-body.css';
import './cm.css';
import { Box } from '@mui/material';
import { useDebouncedCallback } from 'src/hooks/useDebouncedCallback';
import axiosServices from 'src/utils/axios';
import { SERVER_ORIGIN } from 'src/configs';
import { UploadResults } from 'src/components/miscs/NowUploader';
import { restrictedMessage } from 'src/hacks/restrictedMessage';
import { lang } from 'src/components/app/utils';

const EditorMain: React.FC<{
  zh?: boolean;
  defaultValue?: string;
  onChange?: (v: string) => void;
  onSave?: (v: string) => void;
}> = ({
  zh = false,
  defaultValue = '',
  onChange = () => {},
  onSave = () => {},
}) => {
  const [value, setValue] = useState(defaultValue);
  const plugins = [
    breaks(),
    frontmatter(),
    gemoji(),
    highlight(),
    mediumZoom(),
    uplaod({
      locale: zh ? uplaodLocaleZh : uplaodLocaleEn,
      uploadFiles: uploadToServer,
    }),
    gfm({ locale: zh ? gfmLocaleZh : gfmLocaleEn }),
    math({ locale: zh ? mathLocaleZh : mathLocaleEn }),
    mermaid({ locale: zh ? mermaidLocaleZh : mermaidLocaleEn }),
  ];
  const handleSave = useDebouncedCallback(onSave);
  return (
    <Box
      height={1}
      sx={{
        '&>div': {
          height: 1,
          overflow: 'hidden',
        },
      }}
    >
      <Editor
        value={value}
        plugins={plugins}
        locale={zh ? mainLocaleZh : mainLocaleEn}
        onChange={(v) => {
          setValue(v);
          handleSave(v);
          onChange(v);
        }}
      />
    </Box>
  );
};

async function uploadToServer(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('file[]', file);
  });
  try {
    restrictedMessage({
      open: true,
      title: lang('上传', 'Upload'),
      content: lang('正在上传， 请稍候', 'Uploading files. Please wait.'),
      closeable: false,
    });
    const { data } = await axiosServices.post(
      SERVER_ORIGIN + '/api/upload-multi',
      formData
    );
    return (data as UploadResults[]).map(
      ({ url, originalFilename, mimetype }) => {
        return {
          title: originalFilename,
          url,
          isImage: mimetype.startsWith('image'),
        };
      }
    );
  } catch (error) {
    console.warn(error);
    return [];
  } finally {
    restrictedMessage({
      open: false,
      closeable: true,
    });
  }
}

export default EditorMain;
