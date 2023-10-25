import { Linker } from '@local/common';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { calcLinkerOpenUrl, lang } from '../../utils';
import { updateAccessCount } from 'src/store/state/actions/linker';
import LinkerIcon from '../LinkerIcon';
import useEnteredViewport from 'src/hooks/useEnteredViewport';

const width = 90;
const height = 106;

const LinkerDisplay: React.FC<{ linker: Linker }> = ({ linker }) => {
  const [refBox, entered] = useEnteredViewport();
  if (entered) {
    return <LinkerDisplayContent linker={linker} />;
  }
  return <Box ref={refBox} width={width} height={height} p={0.5}></Box>;
};

const LinkerDisplayContent: React.FC<{ linker: Linker }> = ({ linker }) => {
  const { id, name, desc, accessCount, tags, pin } = linker;
  return (
    <Tooltip
      placement="top"
      enterDelay={500}
      followCursor
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
        sx={{
          display: 'inline-block',
          width: 90,
          height: 106,
        }}
        component={'a'}
        href={calcLinkerOpenUrl(linker)}
        target={'_blank'}
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
          <Box height={40}>
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
          </Box>
        </Stack>
      </Box>
    </Tooltip>
  );
};

export default LinkerDisplay;
