import { Stack } from '@mui/material';
import React from 'react';
import {
  FormItemName,
  FormItemTags,
  FormItemDesc,
  FormItemContent,
  FormAction,
} from './parts';

const ArticleForm: React.FC<{}> = () => {
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
