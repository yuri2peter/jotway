// 默认密码检测
import { IconButton, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import { navigate } from 'src/hacks/navigate';
import { requestApi } from 'src/utils/request';
import { lang } from 'src/components/app/utils';

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

export default WarningForDefaultPassword;
