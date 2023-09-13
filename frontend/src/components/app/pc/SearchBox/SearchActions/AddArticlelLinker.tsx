import { ListItem, ListItemButton, Typography } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { openLinkerForm } from 'src/store/state/actions/linker';
import { useMyContext } from './defines';
import { resetSearch } from 'src/store/state/actions/search';
import { useSelector } from 'src/store/state';
import { selectQuery } from 'src/store/state/defaultStore';
import { lang } from 'src/components/app/utils';
import { getNewLinker } from '@local/common';

const AddArticlelLinker: React.FC<{ text: string; selected: boolean }> = ({
  text,
  selected,
}) => {
  const { tag } = useSelector(selectQuery);
  const { refHandleSubmit } = useMyContext();
  const cb = useCallback(() => {
    resetSearch();
    openLinkerForm(
      {
        ...getNewLinker(),
        content: `# ${text}\n\n`,
        article: true,
        name: text,
        tags: tag ? [tag] : [],
      },
      true
    );
  }, [text]);
  useEffect(() => {
    if (selected) {
      refHandleSubmit.current = cb;
    }
  }, [selected, cb]);
  return (
    <ListItem dense>
      <ListItemButton onClick={cb} selected={selected}>
        <NoteAddIcon color={'primary'} />
        <Typography sx={{ whiteSpace: 'nowrap' }} color={'primary'}>
          {lang('撰写笔记', 'Write Note')}
        </Typography>
        <Typography marginLeft={2} noWrap flexGrow={1} color={'text.secondary'}>
          《{text}》
        </Typography>
      </ListItemButton>
    </ListItem>
  );
};

export default AddArticlelLinker;
