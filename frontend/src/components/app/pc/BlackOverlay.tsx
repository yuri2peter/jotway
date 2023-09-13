import { Box } from '@mui/material';
import React from 'react';
import { changeStore, useStore } from 'src/store/state';

const BlackOverlay: React.FC<{}> = () => {
  const {
    search: { focus },
  } = useStore();
  if (!focus) {
    return null;
  }
  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1,
        height: 1,
        zIndex: 2,
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={() => {
        changeStore((d) => {
          d.search.focus = false;
        });
      }}
    ></Box>
  );
};

export default BlackOverlay;
