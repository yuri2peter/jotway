import React from 'react';
import LinkerList from './LinkerList';
import TagSelectorLite from '../../TagSelectorLite';
import { Stack } from '@mui/material';

const Body: React.FC<{}> = () => {
  return (
    <Stack spacing={2} sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
      <TagSelectorLite />
      <LinkerList />
    </Stack>
  );
};

export default Body;
