import { ListItem, ListItemButton, Typography } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { useMyContext } from './defines';
import { Linker } from '@local/common';
import RowStack from 'src/components/RowStack';
import ImageIcon, { ArticleImageIcon } from 'src/components/app/ImageIcon';
import { openLinker } from 'src/store/state/actions/linker';
import { clamp } from 'lodash';
import LinkerIcon from 'src/components/app/LinkerIcon';

const InsiderSearchOne: React.FC<{
  selected: boolean;
  linker: Linker;
  text: string;
  _text: string;
}> = ({ linker, selected, _text, text }) => {
  const { url, name, icon, article } = linker;
  const { refHandleSubmit } = useMyContext();
  const cb = useCallback(() => {
    openLinker(linker);
  }, [linker]);
  useEffect(() => {
    if (selected) {
      refHandleSubmit.current = cb;
    }
  }, [selected, cb]);
  return (
    <ListItem dense>
      <ListItemButton
        selected={selected}
        onClick={cb}
        sx={{ paddingLeft: 2.3 }}
      >
        <LinkerIcon linker={linker} size={20} padding={0} />
        <RowStack marginLeft={0.8} overflow={'hidden'} spacing={2}>
          <Typography noWrap color={'text.primary'} sx={{ flexShrink: 0 }}>
            {name || '-'}
          </Typography>
          <Typography noWrap color={'text.secondary'}>
            {getSearchContext(_text, text)}
          </Typography>
        </RowStack>
      </ListItemButton>
    </ListItem>
  );
};

// 从一段文本中，找出关键字匹配附近的上下文
function getSearchContext(text: string, keyword: string) {
  const width = 20;
  const startIndex = text.toLowerCase().indexOf(keyword.toLowerCase());
  // 返回截取后的文字
  return text.slice(
    clamp(startIndex - width, 0, text.length),
    startIndex + width
  );
}

export default InsiderSearchOne;
