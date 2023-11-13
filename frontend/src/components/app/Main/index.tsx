// 主界面渲染（兼容手机和宽屏）
import { Stack } from '@mui/material';
import React from 'react';
import CentralBox from 'src/components/miscs/CentralBox';
import { glassStyle } from 'src/styles/utils';
import Header from './Header';
import BodyPart from './Body';
import { useSelector } from 'src/store/state';
import { selectIsMobile } from 'src/store/state/defaultStore';
import { useLogic } from './useLogic';
import TagMenu from './ContextMenus/TagMenu';
import BlockMenu from './ContextMenus/BlockMenu';
import LinkerForm from './Modals/LinkerForm';
import AboutModal from './Modals/About';
import SystemModal from './Modals/System';

const Main: React.FC<{}> = () => {
  useLogic();
  const isMobile = useSelector(selectIsMobile);
  return (
    <CentralBox sx={{ height: 1 }}>
      <Stack
        spacing={0}
        sx={{
          width: 1,
          height: 1,
          margin: 1,
          maxWidth: 960,
          maxHeight: isMobile ? '100vh' : 640,
          padding: isMobile ? 1 : 2,
          ...glassStyle(),
        }}
      >
        <Header />
        <BodyPart />
        <TagMenu />
        <BlockMenu />
        <LinkerForm />
        <AboutModal />
        <SystemModal />
      </Stack>
    </CentralBox>
  );
};

export default Main;
