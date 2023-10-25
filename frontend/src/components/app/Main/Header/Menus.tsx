import MenuOutlined from '@ant-design/icons/MenuOutlined';
import { IconButton, Tooltip } from '@mui/material';
import { Menu, Item, Separator, useContextMenu } from 'react-contexify';
import React, { useCallback } from 'react';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PlusOneOutlinedIcon from '@mui/icons-material/PlusOneOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Portal } from '@mui/material';
import { logout } from 'src/store/state/actions/auth';
import { snackbarMessage } from 'src/hacks/snackbarMessage';
import { changeStore, useSelector, useStore } from 'src/store/state';
import { syncFromServer } from 'src/store/state/actions/app';
import { lang } from 'src/components/app/utils';
import { openSystemModal } from 'src/store/state/actions/settings';
import { MAIN_MENU_ID } from '../defines';
import { openLinkerForm } from 'src/store/state/actions/linker';
import { getNewLinker } from '@local/common';
import { selectQuery } from 'src/store/state/defaultStore';

const Menus: React.FC<{}> = () => {
  const { show } = useContextMenu({
    id: MAIN_MENU_ID,
  });
  const handleMenuOpen = useCallback(
    (e: any) => {
      e.stopPropagation();
      show({
        event: e,
      });
    },
    [show]
  );
  return (
    <>
      <Tooltip title={lang('菜单', 'Menu')}>
        <IconButton onClick={handleMenuOpen}>
          <MenuOutlined />
        </IconButton>
      </Tooltip>
      <MainMenu />
    </>
  );
};

const MainMenu: React.FC = () => {
  useStore(); // 强制响应langType更新
  const { tag } = useSelector(selectQuery);
  return (
    <Portal>
      <Menu id={MAIN_MENU_ID} animation="scale" theme="dark">
        <>
          <Item
            onClick={() => {
              openLinkerForm(
                {
                  ...getNewLinker(),
                  tags: tag ? [tag] : [],
                },
                true
              );
            }}
          >
            <PlusOneOutlinedIcon />
            {lang('添加书签', 'New Bookmark')}
          </Item>
          <Item
            onClick={() => {
              openLinkerForm(
                {
                  ...getNewLinker(),
                  article: true,
                  tags: tag ? [tag] : [],
                },
                true
              );
            }}
          >
            <PlusOneOutlinedIcon />
            {lang('添加笔记', 'New Note')}
          </Item>
          <Separator />
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
            {lang('刷新列表', 'Reload Data')}
          </Item>
          <Item onClick={openSystemModal}>
            <SettingsOutlinedIcon />
            {lang('系统设置', 'System')}
          </Item>
          <Item onClick={logout}>
            <LogoutOutlinedIcon />
            {lang('退出登录', 'Log Out')}
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

export default Menus;
