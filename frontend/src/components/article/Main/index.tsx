import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import EditorMain from '../Editor';
import { lang } from 'src/components/app/utils';
import CentralBox from 'src/components/miscs/CentralBox';
import { glassStyle } from 'src/styles/utils';
import { useSelector } from 'src/store/state';
import { selectIsMobile } from 'src/store/state/defaultStore';
import { Linker, linkerSchema } from '@local/common';
import { requestApi } from 'src/utils/request';

const ArticleMain: React.FC<{ id: string }> = ({ id }) => {
  const isMobile = useSelector(selectIsMobile);
  const [updating, setUpdating] = useState(false);
  const [linker, setLinker] = useState<Linker | null>(null);
  useEffect(() => {
    requestApi('linker/get', { id }).then(({ linker }) => {
      const linkerParsed = linkerSchema.parse(linker);
      setLinker(linkerParsed);
    });
  }, [id]);
  const handleChange = useCallback(() => {
    setUpdating(true);
  }, []);
  const handleSave = useCallback(
    (v: string) => {
      requestApi('linker/update-content', {
        id,
        content: v,
      }).finally(() => {
        setUpdating(false);
      });
    },
    [id]
  );
  if (!linker) {
    return null;
  }
  return (
    <CentralBox sx={{ height: 1 }}>
      <Box
        sx={{
          width: 1,
          height: 1,
          maxWidth: 1600,
          maxHeight: isMobile ? '100vh' : 860,
          padding: 0,
          margin: isMobile ? 0 : 2,
          overflow: 'hidden',
          ...glassStyle(),
        }}
      >
        <Helmet>
          <title>
            {updating ? '* ' : ''}
            {linker.name}
          </title>
        </Helmet>
        <EditorMain
          zh={lang(true, false)}
          defaultValue={linker.content}
          onChange={handleChange}
          onSave={handleSave}
        />
      </Box>
    </CentralBox>
  );
};

export default ArticleMain;
