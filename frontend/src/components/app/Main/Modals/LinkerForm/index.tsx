import { Box } from '@mui/material';
import React, { useMemo } from 'react';
import Modal from 'src/components/miscs/Modal';
import { useStore } from 'src/store/state';
import { closeLinkerForm } from 'src/store/state/actions/linker';
import UrlForm from './UrlForm';
import ArticleForm from './ArticleForm';

const LinkerForm: React.FC<{}> = () => {
  const {
    linkerForm: { open, linker },
  } = useStore();
  const { name, article } = linker;

  const form = useMemo(() => {
    if (article) {
      return <ArticleForm />;
    }
    return <UrlForm />;
  }, [article]);
  return (
    <Modal onClose={closeLinkerForm} title={name} open={open} maxWidth="md">
      <Box maxWidth={840}>{form}</Box>
    </Modal>
  );
};

export default LinkerForm;
