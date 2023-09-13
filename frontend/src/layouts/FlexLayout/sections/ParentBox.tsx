import { Box } from '@mui/material';
import React from 'react';
import BackgroundLoader from './Background';
import { useLayoutContext } from './context';
import { IS_PROD } from 'src/configs';

const ParentBox: React.FC<{
  sizerRef: any;
  height: number;
  children: React.ReactNode;
}> = ({ sizerRef, height, children }) => {
  const { mode } = useLayoutContext();
  return (
    <Box
      ref={sizerRef}
      onContextMenu={(e) => {
        // 生产模式下，禁用右键
        IS_PROD && e.preventDefault();
      }}
      sx={{
        width: '100vw',
        height: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {mode !== 'INIT' && <BackgroundLoader />}
      {children}
    </Box>
  );
};

export default ParentBox;
