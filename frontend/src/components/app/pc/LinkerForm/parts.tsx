import { Button, TextField, Typography } from '@mui/material';
import React from 'react';
import FlexFiller from 'src/components/FlexFiller';
import RowStack from 'src/components/RowStack';
import { changeStore, useStore } from 'src/store/state';
import LinkerDisplayLite from '../LinkerDisplayLite';
import { closeLinkerForm, saveLinker } from 'src/store/state/actions/linker';
import TagSelector from '../TagSelector';
import { lang } from 'src/components/app/utils';

export const FormItemName = () => {
  const {
    linkerForm: {
      linker: { name },
    },
  } = useStore();
  return (
    <FormItem title={lang('名称', 'Name')}>
      <TextField
        autoFocus
        fullWidth
        value={name}
        multiline
        onChange={(e) => {
          changeStore((d) => {
            d.linkerForm.linker.name = e.target.value;
          });
        }}
      />
    </FormItem>
  );
};

export const FormItemTags = () => {
  const {
    linkerForm: {
      linker: { tags },
    },
  } = useStore();
  return (
    <FormItem title={lang('标签', 'Tags')}>
      <TagSelector
        value={tags}
        onChange={(v) => {
          changeStore((d) => {
            d.linkerForm.linker.tags = v;
          });
        }}
      />
    </FormItem>
  );
};

export const FormItemDesc = () => {
  const {
    linkerForm: {
      linker: { desc },
    },
  } = useStore();
  return (
    <FormItem title={lang('简述', 'Desc')}>
      <TextField
        fullWidth
        value={desc}
        multiline
        onChange={(e) => {
          changeStore((d) => {
            d.linkerForm.linker.desc = e.target.value;
          });
        }}
      />
    </FormItem>
  );
};

export const FormItemContent = () => {
  const {
    linkerForm: {
      linker: { content },
    },
  } = useStore();
  return (
    <FormItem title={lang('内容', 'Content')}>
      <TextField
        fullWidth
        value={content}
        multiline
        maxRows={12}
        onChange={(e) => {
          changeStore((d) => {
            d.linkerForm.linker.content = e.target.value;
          });
        }}
      />
    </FormItem>
  );
};

export const FormAction = () => {
  const {
    linkerForm: { linker },
  } = useStore();
  return (
    <RowStack>
      <LinkerDisplayLite linker={linker} />
      <FlexFiller />
      <Button variant="contained" onClick={saveLinker}>
        {lang('保存', 'Save')}
      </Button>
      <Button variant="outlined" onClick={closeLinkerForm}>
        {lang('取消', 'Cancel')}
      </Button>
    </RowStack>
  );
};

export const FormItem: React.FC<{
  title: string;
  children: React.ReactElement;
}> = ({ title, children }) => {
  return (
    <RowStack alignItems={'flex-start'}>
      <Typography
        sx={{ paddingTop: 1, width: '4em', flexGrow: 0, flexShrink: 0 }}
      >
        {title}:{' '}
      </Typography>
      {children}
    </RowStack>
  );
};
