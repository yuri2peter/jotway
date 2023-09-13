import React from 'react';
import { IconButton } from '@mui/material';
import RowStack from 'src/components/RowStack';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchInput from '../SearchInput';
import { useStore } from 'src/store/state';
import { logout } from 'src/store/state/actions/auth';

const Header: React.FC<{}> = () => {
  const {
    appearance: { mobileAtTop },
  } = useStore();
  return (
    <RowStack p={2} spacing={1}>
      {/* 搜索 */}
      <SearchInput />
      {mobileAtTop ? (
        <IconButton onClick={logout} color="primary">
          <LogoutIcon />
        </IconButton>
      ) : (
        <IconButton
          color="primary"
          onClick={() => {
            const btn = document.getElementById('btn-tag-class');
            if (btn) {
              btn.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <VerticalAlignTopIcon />
        </IconButton>
      )}
    </RowStack>
  );
};

export default Header;
