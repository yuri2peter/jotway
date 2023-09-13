import React, { useCallback } from 'react';
import LinkerList from '../LinkerList';
import TagSelectorLite from '../../TagSelectorLite';
import { Stack } from '@mui/material';
import { glassStyle } from 'src/styles/utils';
import SearchBox from '../SearchBox';
import { MENU_ID } from '../MainMenu';
import { useContextMenu } from 'react-contexify';

const Body: React.FC<{}> = () => {
  const { show: show } = useContextMenu({
    id: MENU_ID,
  });
  const handleMenuOpen = useCallback((e: any) => {
    e.stopPropagation();
    show({
      event: e,
    });
  }, []);
  return (
    <Stack spacing={8} alignItems={'center'}>
      <SearchBox />
      <Stack
        spacing={3}
        alignItems={'center'}
        sx={{
          padding: 3,
          ...glassStyle(),
        }}
        onContextMenu={(e) => {
          e.stopPropagation();
          handleMenuOpen(e);
        }}
      >
        <TagSelectorLite />
        <LinkerList />
      </Stack>
    </Stack>
  );
};

export default Body;
