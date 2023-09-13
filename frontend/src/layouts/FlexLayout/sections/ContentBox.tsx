import React from 'react';
import { Box, Paper } from '@mui/material';
import { useLayoutContext } from './context';
import Storyboard from './Storyboard';
import { Outlet } from 'react-router-dom';
import { config } from '../config';
import { useNoScale } from 'src/hooks/useNoScale';

const ContentBox: React.FC<{ fullScreen?: boolean }> = ({
  fullScreen = true,
}) => {
  const { width, height, isMobile } = useLayoutContext();
  return (
    <Box
      sx={{
        ...(fullScreen
          ? {
              width: '100%',
              height: '100%',
              overflow: 'auto',
              flexShrink: 0,
            }
          : {
              width,
              height,
              position: 'relative',
              overflow: 'hidden',
            }),
      }}
    >
      {isMobile && config.enableMobileNoScaleHack && <MobileHack />}
      <Storyboard />
      <Outlet />
    </Box>
  );
};

const MobileHack: React.FC = () => {
  useNoScale();
  return null;
};
export default ContentBox;
