import React from 'react';
import { Box } from '@mui/material';
import Footer from 'src/components/app/pc/Footer';
import Header from 'src/components/app/pc/Header';
import Body from 'src/components/app/pc/Body';
import BlackOverlay from 'src/components/app/pc/BlackOverlay';
import LinkerForm from 'src/components/app/pc/LinkerForm';
import SystemModal from './System';
import MainMenu from './MainMenu';
import Floor from './Floor';
import AboutModal from './About';
import TagMenu from './TagMenu';
import { useLogic } from './useLogic';

const PcPage: React.FC<{}> = () => {
  useLogic();
  return (
    <>
      <Box
        sx={{
          height: 1,
          p: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Floor />
        <BlackOverlay />
        <LinkerForm />

        <Header />
        <Body />
        <Footer />
        <MainMenu />
        <TagMenu />
        <SystemModal />
        <AboutModal />
      </Box>
    </>
  );
};

export default PcPage;
