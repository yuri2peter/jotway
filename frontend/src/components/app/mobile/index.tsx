import { Stack } from '@mui/material';
import React from 'react';
import Header from './Header';
import Body from './Body';
import { glassStyle } from 'src/styles/utils';

const MobilePage: React.FC<{}> = () => {
  return (
    <Stack
      height={1}
      overflow={'auto'}
      spacing={0.5}
      sx={{
        ...glassStyle(),
        padding: 0,
        borderRadius: 0,
        backdropFilter: 'blur(8px)',
      }}
    >
      <Header />
      <Body />
    </Stack>
  );
};

export default MobilePage;
