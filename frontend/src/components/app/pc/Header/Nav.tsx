import { IconButton, Tooltip } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import React, { useEffect, useState } from 'react';
import RowStack from 'src/components/RowStack';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import FlexFiller from 'src/components/FlexFiller';
import { navigate } from 'src/hacks/navigate';
import { requestApi } from 'src/utils/request';
import { lang } from 'src/components/app/utils';
import Clock from '../Clock';
import { openSystemModal } from 'src/store/state/actions/settings';

const Nav: React.FC<{}> = () => {
  return (
    <RowStack height={48} sx={{ width: '100vw' }} px={2}>
      <Clock />
      <FlexFiller />
      {/* 默认密码检测 */}
      <WarningForDefaultPassword />
      <Tooltip title={lang('系统', 'System')}>
        <IconButton onClick={openSystemModal}>
          <SettingsOutlinedIcon />
        </IconButton>
      </Tooltip>
    </RowStack>
  );
};

// 默认密码检测
const WarningForDefaultPassword: React.FC<{}> = () => {
  const [isDefault, setIsDefault] = useState(false);
  useEffect(() => {
    requestApi('auth/is-default-password').then(({ isDefaultPassword }) => {
      setIsDefault(isDefaultPassword);
    });
  }, []);
  if (!isDefault) {
    return null;
  }
  return (
    <Tooltip
      title={lang(
        '检测到默认密码，点击立即修改！',
        'Detected default password, click to change immediately!'
      )}
    >
      <IconButton
        onClick={() => {
          navigate('/reset-password');
        }}
      >
        <WarningOutlinedIcon color="warning" />
      </IconButton>
    </Tooltip>
  );
};

export default Nav;
