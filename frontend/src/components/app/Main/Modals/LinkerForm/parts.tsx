import { Button, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import FlexFiller from 'src/components/miscs/FlexFiller';
import RowStack from 'src/components/miscs/RowStack';
import { changeStore, useSelector, useStore } from 'src/store/state';
import { closeLinkerForm, saveLinker } from 'src/store/state/actions/linker';
import { lang } from 'src/components/app/utils';
import TagSelector from './TagSelector';
import { selectIsMobile } from 'src/store/state/defaultStore';

export const FormItemName = () => {
  const {
    linkerForm: {
      linker: { name },
    },
  } = useStore();
  return (
    <FormItem title={lang('名称', 'Name')}>
      <TextField
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
  return (
    <RowStack>
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
  const isMobile = useSelector(selectIsMobile);
  if (isMobile) {
    return (
      <Stack spacing={0.5}>
        <Typography
          sx={{ paddingTop: 1, width: '4em', flexGrow: 0, flexShrink: 0 }}
        >
          {title}:{' '}
        </Typography>
        {children}
      </Stack>
    );
  }
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
