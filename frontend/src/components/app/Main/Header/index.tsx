// 主界面渲染（兼容手机和宽屏）
import { Box } from '@mui/material';
import React from 'react';
import Search from './Search';
import RowStack from 'src/components/miscs/RowStack';
import Clock from './Clock';
import Menus from './Menus';
import WarningForDefaultPassword from './WarningForDefaultPassword';

const Header: React.FC<{}> = () => {
  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        flexShrink: 0,
        paddingBottom: 2,
      }}
    >
      <RowStack spacing={2}>
        <Clock />
        <Search />
        <WarningForDefaultPassword />
        <Menus />
      </RowStack>
    </Box>
  );
};

export default Header;
