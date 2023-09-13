import { Menu, Item, Separator } from 'react-contexify';
import React from 'react';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Portal } from '@mui/material';
import { logout } from 'src/store/state/actions/auth';
import { snackbarMessage } from 'src/hacks/snackbarMessage';
import { changeStore, useStore } from 'src/store/state';
import { syncFromServer } from 'src/store/state/actions/app';
import { lang } from 'src/components/app/utils';
import { openSystemModal } from 'src/store/state/actions/settings';

export const MENU_ID = 'MainMenu';

const MainMenu: React.FC = () => {
  useStore(); // 强制响应langType更新
  return (
    <Portal>
      <Menu id={MENU_ID} animation="scale" theme="dark">
        <>
          <Item
            onClick={async () => {
              try {
                await syncFromServer();
                snackbarMessage(
                  lang('刷新成功', 'Reload successful.'),
                  'success'
                );
              } catch (error) {
                console.warn(error);
                snackbarMessage(lang('刷新失败', 'Reload failed.'), 'error');
              }
            }}
          >
            <ReplayOutlinedIcon />
            {lang('刷新', 'Reload Data')}
          </Item>
          <Item onClick={openSystemModal}>
            <SettingsOutlinedIcon />
            {lang('系统', 'System')}
          </Item>
          <Item onClick={logout}>
            <LogoutOutlinedIcon />
            {lang('退出', 'Log Out')}
          </Item>
          <Separator />
          <Item
            onClick={() => {
              changeStore((d) => {
                d.appearance.aboutModalOpen = true;
              });
            }}
          >
            <InfoOutlinedIcon />
            {lang('关于', 'About Us')}
          </Item>
        </>
      </Menu>
    </Portal>
  );
};

export default MainMenu;
