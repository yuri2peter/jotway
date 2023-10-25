import { Box } from '@mui/material';
import React from 'react';
import { useStore } from 'src/store/state';
import { bg } from 'src/utils/miscs';

const Background: React.FC = () => {
  const {
    appearance: { bgImage },
  } = useStore();
  const commonSx = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: -2,
    top: 0,
    left: 0,
    background: bg(bgImage),
    // filter: 'blur(8px)',
  };
  return (
    <>
      <Box
        sx={{
          ...commonSx,
        }}
      ></Box>
      <Box
        sx={{
          ...commonSx,
          zIndex: -1,
          background: 'rgba(0,0,0,0.3)',
        }}
      ></Box>
    </>
  );
};

export default Background;
