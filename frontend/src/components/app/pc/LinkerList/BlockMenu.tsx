import { Menu, Item, Separator } from 'react-contexify';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import React from 'react';
import { useSelector } from 'src/store/state';
import {
  deleteLinker,
  openLinker,
  openLinkerForm,
  saveLinkerDirectly,
  setPin,
  transToArticle,
} from 'src/store/state/actions/linker';
import { selectLinkers } from 'src/store/state/defaultStore';
import { Portal } from '@mui/material';
import { lang } from 'src/components/app/utils';
import { nanoid } from 'nanoid';
import { autoRenameWithIndex } from 'src/utils/miscs';
import { snackbarMessage } from 'src/hacks/snackbarMessage';

export const MENU_ID = 'BlockMenu';

const BlockMenu: React.FC<{ linkerId: string }> = ({ linkerId }) => {
  const linkers = useSelector(selectLinkers);
  const linker = linkers.find((l) => l.id === linkerId);
  return (
    <Portal>
      <Menu id={MENU_ID} animation="scale" theme="dark">
        {linker ? (
          <>
            <Item disabled>{linker.name}</Item>
            <Separator />
            <Item
              onClick={() => {
                openLinker(linker);
              }}
            >
              <FileOpenOutlinedIcon /> {lang('打开', 'Open')}
            </Item>
            <Item
              onClick={() => {
                openLinkerForm(linker);
              }}
            >
              <ModeEditOutlineOutlinedIcon />
              {lang('编辑', 'Edit')}
            </Item>
            {linker.pin ? (
              <Item
                onClick={() => {
                  setPin(linker, false);
                }}
              >
                <PushPinOutlinedIcon />
                {lang('取消置顶', 'Unpin')}
              </Item>
            ) : (
              <Item
                onClick={() => {
                  setPin(linker, true);
                }}
              >
                <PushPinOutlinedIcon />
                {lang('置顶', 'Pin')}
              </Item>
            )}
            <Item
              onClick={async () => {
                const newName = autoRenameWithIndex(
                  linker.name,
                  linkers.map((l) => l.name)
                );
                await saveLinkerDirectly({
                  ...linker,
                  id: nanoid(),
                  name: newName,
                });
                snackbarMessage(
                  lang(`已保存为 ${newName}`, `Saved as ${newName}`),
                  'success'
                );
              }}
            >
              <ContentCopyIcon />
              {lang('克隆', 'Clone')}
            </Item>
            {!linker.article ? (
              <Item
                onClick={async () => {
                  await transToArticle(linker.id);
                  openLinker({ ...linker, article: true });
                }}
              >
                <DescriptionOutlinedIcon />
                {lang('转换为笔记', 'Convert To Note')}
              </Item>
            ) : null}
            <Item
              onClick={() => {
                if (!linker) {
                  return;
                }
                deleteLinker(linker.id);
              }}
            >
              <DeleteForeverOutlinedIcon />
              {lang('删除', 'Delete')}
            </Item>
          </>
        ) : (
          <Item disabled>
            <DeleteForeverOutlinedIcon />
            {lang('已删除', 'Deleted')}
          </Item>
        )}
      </Menu>
    </Portal>
  );
};

export default BlockMenu;
