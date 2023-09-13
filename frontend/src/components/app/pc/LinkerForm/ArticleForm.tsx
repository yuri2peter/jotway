import { Stack } from '@mui/material';
import React from 'react';
import { useStore } from 'src/store/state';
import {
  FormItemName,
  FormItemTags,
  FormItemDesc,
  FormItemContent,
  FormAction,
} from './parts';

const ArticleForm: React.FC<{}> = () => {
  const {
    linkerForm: {
      linker: { content },
    },
  } = useStore();
  return (
    <Stack spacing={2} justifyContent={'stretch'}>
      <FormItemName />
      <FormItemTags />
      <FormItemDesc />
      <FormItemContent />
      <FormAction />
    </Stack>
  );
};

export default ArticleForm;
