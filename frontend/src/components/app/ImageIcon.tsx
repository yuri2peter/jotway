import { Box, SxProps } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { getAbsoluteUrl } from 'src/utils/miscs';

const defaultSrc = '/logos/512.jpg';

function commonSx({
  size,
  padding,
  bgColor,
}: {
  size: number;
  padding: number;
  bgColor: string;
}): any {
  return {
    flexShrink: 0,
    width: size + 'px',
    height: size + 'px',
    borderRadius: '25%',
    display: 'inline-block',
    verticalAlign: 'middle',
    border: padding + 'px solid ' + bgColor,
    background: 'white',
    overflow: 'hidden',
    // imageRendering: 'pixelated',
  };
}

const ImageIcon: React.FC<{
  src?: string;
  size?: number;
  padding?: number;
  baseUrl?: string;
  sx?: SxProps;
  bgColor?: string;
}> = ({
  src = '',
  size = 19,
  baseUrl = '',
  sx = {},
  padding = 0,
  bgColor = 'white',
}) => {
  const imgSrcFixed = useMemo(() => {
    return getAbsoluteUrl(src, baseUrl);
  }, [src, baseUrl]);
  const [imgSrc, setImgSrc] = useState(imgSrcFixed);
  useEffect(() => {
    setImgSrc(imgSrcFixed);
  }, [imgSrcFixed]);
  return (
    <Box
      sx={{
        ...commonSx({ size, padding, bgColor }),
        ...sx,
      }}
    >
      <Box
        component="img"
        sx={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
        src={imgSrc}
        onError={() => {
          setImgSrc(defaultSrc);
        }}
      ></Box>
    </Box>
  );
};

export const ArticleImageIcon: React.FC<{
  size?: number;
  padding?: number;
  sx?: SxProps;
  bgColor?: string;
}> = ({ size = 19, padding = 0, sx = {}, bgColor = 'white' }) => {
  return (
    <Box
      sx={{
        ...commonSx({ size, padding, bgColor }),
        ...sx,
      }}
    >
      <Box
        component="img"
        sx={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
        src={'/logos/note.png'}
      ></Box>
    </Box>
  );
};

export default ImageIcon;
