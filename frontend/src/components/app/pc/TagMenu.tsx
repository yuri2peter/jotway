import { Menu, Item, Separator } from 'react-contexify';
import React from 'react';
import { Portal } from '@mui/material';
import { snackbarMessage } from 'src/hacks/snackbarMessage';
import { changeStore, getStore, useStore } from 'src/store/state';
import { saveLinkerDirectly } from 'src/store/state/actions/linker';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { dialogPrompt } from 'src/hacks/prompt';
import { lang } from 'src/components/app/utils';

export const MENU_ID = 'TagMenu';

const TagMenu: React.FC = () => {
  const {
    appearance: { tagMenuTagName },
  } = useStore();
  return (
    <Portal>
      <Menu id={MENU_ID} animation="scale" theme="dark">
        <>
          <Item disabled>{tagMenuTagName}</Item>
          <Separator />
          <Item onClick={renameTag}>
            <DriveFileRenameOutlineIcon />
            {lang('标签改名', 'Rename Tag')}
          </Item>
          <Item onClick={deleteTag}>
            <DeleteForeverOutlinedIcon />
            {lang('标签删除', 'Delete Tag')}
          </Item>
        </>
      </Menu>
    </Portal>
  );
};

async function renameTag() {
  const {
    linkers,
    appearance: { tagMenuTagName },
  } = getStore();
  let renameTo = '';
  try {
    renameTo = await dialogPrompt({ defaultInputValue: tagMenuTagName });
  } catch (error) {
    return;
  }
  if (renameTo === tagMenuTagName || !renameTo) {
    return;
  }
  try {
    changeStore((d) => {
      d.query.tag = renameTo;
    });
    for (const linker of linkers) {
      if (linker.tags.includes(tagMenuTagName)) {
        await saveLinkerDirectly({
          ...linker,
          tags: [
            ...linker.tags.filter((tag) => tag !== tagMenuTagName),
            renameTo,
          ],
        });
      }
    }
    snackbarMessage(lang('操作成功', 'Operation successful.'), 'success');
  } catch (error) {
    console.warn(error);
    snackbarMessage(lang('操作失败', 'Operation failed.'), 'error');
  }
}

async function deleteTag() {
  try {
    const {
      linkers,
      appearance: { tagMenuTagName },
    } = getStore();
    for (const linker of linkers) {
      if (linker.tags.includes(tagMenuTagName)) {
        await saveLinkerDirectly({
          ...linker,
          tags: linker.tags.filter((tag) => tag !== tagMenuTagName),
        });
      }
    }
    snackbarMessage(lang('操作成功', 'Operation successful.'), 'success');
  } catch (error) {
    console.warn(error);
    snackbarMessage(lang('操作失败', 'Operation failed.'), 'error');
  }
}

export default TagMenu;
