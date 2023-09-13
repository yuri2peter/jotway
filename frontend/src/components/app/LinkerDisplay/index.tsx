import { Linker } from '@local/common';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { calcLinkerOpenUrl, lang } from '../utils';
import { updateAccessCount } from 'src/store/state/actions/linker';
import ImageIcon, { ArticleImageIcon } from '../ImageIcon';
import LinkerIcon from '../LinkerIcon';

const LinkerDisplay: React.FC<{ linker: Linker; fullwidth?: boolean }> = ({
  linker,
}) => {
  const { id, name, desc, accessCount, tags, pin } = linker;
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
        sx={{ display: 'inline-block', width: '100%' }}
        onClick={() => {
          updateAccessCount(id);
        }}
      >
        <Stack
          alignItems={'center'}
          spacing={1}
          sx={{
            maxWidth: 200,
            padding: 1,
          }}
        >
          <LinkerIcon linker={linker} />
          <Stack overflow={'hidden'} spacing={0}>
            <Typography
              variant="caption"
              color={pin ? '#86fffa' : 'text.primary'}
              textAlign={'center'}
              sx={{
                wordBreak: 'break-word',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
              }}
            >
              {name || '-'}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Tooltip>
  );
};

export default LinkerDisplay;
