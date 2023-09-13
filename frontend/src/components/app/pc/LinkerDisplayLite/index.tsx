import { Linker } from '@local/common';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import RowStack from 'src/components/RowStack';
import { calcLinkerOpenUrl } from '../../utils';
import { updateAccessCount } from 'src/store/state/actions/linker';
import ImageIcon, { ArticleImageIcon } from '../../ImageIcon';
import { lang } from 'src/components/app/utils';

const LinkerDisplayLite: React.FC<{ linker: Linker; fullwidth?: boolean }> = ({
  linker,
  fullwidth = false,
}) => {
  const { id, url, name, desc, icon, tags, article, accessCount, pin } = linker;
  return (
    <Tooltip
      placement="top"
      title={
        <>
          {name && (
            <>
              {name} <br /> <br />
            </>
          )}
          {desc && (
            <>
              {desc} <br /> <br />
            </>
          )}
          {[lang(`访问${accessCount}次`, `${accessCount} views`), ...tags].join(
            ', '
          )}
        </>
      }
    >
      <Box
        component={'a'}
        href={calcLinkerOpenUrl(linker)}
        target={'_blank'}
        sx={{ display: 'inline-block', width: fullwidth ? '100%' : 'auto' }}
        onClick={() => {
          updateAccessCount(id);
        }}
      >
        <RowStack
          sx={{
            borderRadius: 2,
            maxWidth: 160,
            padding: 1,
          }}
        >
          {article ? (
            <ArticleImageIcon size={24} padding={0} />
          ) : (
            <ImageIcon src={icon} baseUrl={url} size={24} padding={0} />
          )}
          <Stack overflow={'hidden'} spacing={0}>
            <Typography
              noWrap
              variant="caption"
              color={pin ? '#86fffa' : 'text.primary'}
            >
              {name || '-'}
            </Typography>
          </Stack>
        </RowStack>
      </Box>
    </Tooltip>
  );
};

export default LinkerDisplayLite;
