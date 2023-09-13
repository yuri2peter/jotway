import { ListItem, ListItemButton, Typography } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { changeStore } from 'src/store/state';
import { useMyContext } from './defines';
import { resetSearch } from 'src/store/state/actions/search';
import { lang } from 'src/components/app/utils';

const InsiderSearchMore: React.FC<{
  text: string;
  selected: boolean;
  count: number;
}> = ({ text, selected, count }) => {
  const { refHandleSubmit } = useMyContext();
  const cb = useCallback(() => {
    resetSearch();
    changeStore((d) => {
      d.query.keyword = text;
      d.query.tagClass = 'keyword';
      d.query.pageIndex = 0;
      d.query.tag = '';
    });
  }, [changeStore, text]);
  useEffect(() => {
    if (selected) {
      refHandleSubmit.current = cb;
    }
  }, [selected, cb]);
  return (
    <ListItem dense>
      <ListItemButton selected={selected} onClick={cb}>
        <SearchIcon color={'primary'} />
        <Typography sx={{ whiteSpace: 'nowrap' }} color={'primary'}>
          {lang('站内搜索', 'Site Search')}
        </Typography>
        <Typography marginLeft={2} noWrap flexGrow={1} color={'text.secondary'}>
          {lang(`查看更多(${count}个结果)`, `View More(${count} results)`)}
        </Typography>
      </ListItemButton>
    </ListItem>
  );
};

export default InsiderSearchMore;
