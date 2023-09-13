import { Box } from '@mui/material';
import React from 'react';
import RowStack from 'src/components/RowStack';
import { useStore } from 'src/store/state';
import LeftTabs from './LeftTabs';
import Network from './Network';
import Appearance from './Appearance';
import DataSection from './Data';

const Settings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    systemForm: { tabIndex },
  } = useStore();
  return (
    <RowStack
      sx={{
        padding: 1,
        width: 800,
        height: 400,
      }}
      // alignItems={'flex-start'}
    >
      <LeftTabs />
      <Box pl={2} flexGrow={1} overflow="auto" height={1}>
        {tabIndex === 0 && <Appearance />}
        {tabIndex === 1 && <Network />}
        {tabIndex === 2 && <DataSection />}
      </Box>
    </RowStack>
  );
};

export default Settings;
