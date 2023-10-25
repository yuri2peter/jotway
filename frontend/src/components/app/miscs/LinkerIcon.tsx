import { Linker } from '@local/common';
import React from 'react';
import ImageIcon, { ArticleImageIcon } from './ImageIcon';

const noteBg = '#76adfd';

const LinkerIcon: React.FC<{
  linker: Linker;
  size?: number;
  padding?: number;
}> = ({ linker: { icon, article, content, url }, size = 42, padding = 4 }) => {
  if (!article) {
    return (
      <ImageIcon
        src={icon}
        baseUrl={url}
        size={size}
        padding={padding}
        bgColor="#fff"
      />
    );
  }
  // 尝试从正文中找出图片
  const markdownImagePreg = /!\[(.*)\]\((.*)\)/;
  const rel = markdownImagePreg.exec(content);
  if (rel?.[2]) {
    return (
      <ImageIcon
        src={rel[2]}
        baseUrl={''}
        size={size}
        padding={padding}
        bgColor={noteBg}
      />
    );
  }
  // 尝试使用icon地址
  if (icon) {
    return (
      <ImageIcon
        src={icon}
        baseUrl={url}
        size={size}
        padding={padding}
        bgColor={noteBg}
      />
    );
  }
  return <ArticleImageIcon size={size} padding={4} bgColor={noteBg} />;
};

export default LinkerIcon;
