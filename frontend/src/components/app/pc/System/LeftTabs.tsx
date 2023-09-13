import React from 'react';
import { Tabs, Tab } from '@mui/material';
import { changeStore, useStore } from 'src/store/state';
import { lang } from 'src/components/app/utils';

const LeftTabs: React.FC<{}> = () => {
  const {
    systemForm: { tabIndex },
  } = useStore();
  return (
    <Tabs
      orientation="vertical"
      variant="scrollable"
      value={tabIndex}
      onChange={(e, v) => {
        changeStore((d) => {
          d.systemForm.tabIndex = v;
        });
      }}
      sx={{
        height: '100%',
        flexShrink: 0,
        borderRight: 1,
        borderColor: 'divider',
        '& .MuiButtonBase-root': {
          fontSize: '1em',
        },
        '& .Mui-selected': {
          color: 'white !important',
        },
      }}
    >
      <Tab label={lang('外观', 'Appearance')} />
      <Tab label={lang('网络', 'Network')} />
      <Tab label={lang('数据', 'Data')} />
    </Tabs>
  );
};

export default LeftTabs;
