// 位于最底层的box，用于触发右键主菜单
import { Box } from '@mui/material';
import React, { useCallback } from 'react';
import { useContextMenu } from 'react-contexify';
import { changeStore } from 'src/store/state';
import { MENU_ID } from './MainMenu';

const Floor: React.FC<{}> = () => {
  const { show } = useContextMenu({
    id: MENU_ID,
  });
  const handleMenuOpen = useCallback((e: any) => {
    e.stopPropagation();
    show({
      event: e,
    });
  }, []);
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1,
        height: 1,
        zIndex: 0,
      }}
      onClick={() => {
        changeStore((d) => {
          d.search.focus = false;
        });
      }}
      onContextMenu={(e) => {
        handleMenuOpen(e);
      }}
    ></Box>
  );
};

export default Floor;
