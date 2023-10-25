import { Box, Stack } from '@mui/material';
import React from 'react';
import RowStack from 'src/components/miscs/RowStack';
import { useSelector, useStore } from 'src/store/state';
import SystemTabs from './SystemTabs';
import Network from './Network';
import Appearance from './Appearance';
import DataSection from './Data';
import { selectIsMobile } from 'src/store/state/defaultStore';

const Settings: React.FC = () => {
  const {
    systemForm: { tabIndex },
  } = useStore();
  const isMobile = useSelector(selectIsMobile);
  const tabContents = (
    <>
      {tabIndex === 0 && <Appearance />}
      {tabIndex === 1 && <Network />}
      {tabIndex === 2 && <DataSection />}
    </>
  );
  if (isMobile) {
    return (
      <Stack>
        <SystemTabs />
        <Box
          mt={2}
          flexGrow={1}
          overflow="auto"
          height={480}
          width={'calc(100vw - 128px)'}
        >
          {tabContents}
        </Box>
      </Stack>
    );
  }
  return (
    <RowStack
      sx={{
        padding: 1,
        height: 400,
      }}
    >
      <SystemTabs />
      <Box
        pl={2}
        flexGrow={1}
        overflow="auto"
        height={1}
        width={'min(calc(100vw - 128px), 600px)'}
      >
        {tabContents}
      </Box>
    </RowStack>
  );
};

export default Settings;
