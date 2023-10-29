import React from 'react';
import { changeStore, useStore } from 'src/store/state';
import Modal from 'src/components/miscs/Modal';
import { Box, Stack, Typography } from '@mui/material';
import { lang } from 'src/components/app/utils';
import { appVersion, githubHref } from '@local/common';

const AboutModal: React.FC = () => {
  const {
    appearance: { aboutModalOpen },
  } = useStore();
  const handleClose = async () => {
    changeStore((d) => {
      d.appearance.aboutModalOpen = false;
    });
  };
  return (
    <Modal
      title={lang('关于', 'About Us')}
      onClose={handleClose}
      maxWidth="sm"
      open={aboutModalOpen}
    >
      <Stack maxWidth={300}>
        <Typography variant="h5" marginBottom={3}>
          Jotway
        </Typography>
        <Typography>
          {lang('版本', 'Version')}: {appVersion}
        </Typography>
        <Typography noWrap>
          {lang('社区: ', 'Community: ')}
          <Box component={'a'} href={githubHref} target="_blank">
            github.com/yuri2peter/jotway
          </Box>
        </Typography>
        <Typography noWrap>
          {lang('邮件: ', 'Email: ')}
          <Box
            component={'a'}
            href={'mailto:yuri2peter@qq.com'}
            target="_blank"
          >
            yuri2peter@qq.com
          </Box>
        </Typography>
      </Stack>
    </Modal>
  );
};

export default AboutModal;
