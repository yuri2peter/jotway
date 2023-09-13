import { ListItem, ListItemButton, Typography } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import LanguageIcon from '@mui/icons-material/Language';
import { useMyContext } from './defines';
import { resetSearch } from 'src/store/state/actions/search';
import { useStore } from 'src/store/state';
import { lang } from 'src/components/app/utils';

const WwwSearch: React.FC<{ text: string; selected: boolean }> = ({
  text,
  selected,
}) => {
  const {
    settings: { searchUrl },
  } = useStore();
  const searchUrl1 = searchUrl || 'https://www.baidu.com/s?wd=TEXT';
  const { refHandleSubmit } = useMyContext();
  const cb = useCallback(async () => {
    resetSearch();
    const searchText = encodeURIComponent(text);
    window.open(searchUrl1.replace('TEXT', searchText), '_blank');
  }, [text]);
  useEffect(() => {
    if (selected) {
      refHandleSubmit.current = cb;
    }
  }, [selected, cb]);
  return (
    <ListItem dense>
      <ListItemButton selected={selected} onClick={cb}>
        <LanguageIcon color={'primary'} />
        <Typography sx={{ whiteSpace: 'nowrap' }} color={'primary'}>
          {lang('外网搜索', 'External Web Search')}
        </Typography>
        <Typography marginLeft={2} noWrap flexGrow={1} color={'text.secondary'}>
          {searchUrl.replace('TEXT', text)}
        </Typography>
      </ListItemButton>
    </ListItem>
  );
};

export default WwwSearch;
