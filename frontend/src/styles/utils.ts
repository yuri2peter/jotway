import { SxProps } from '@mui/material';

// 生成玻璃样式
export function glassStyle(transparency = 0.1): SxProps {
  return {
    background: `rgba(240,252,255, ${transparency})`,
    // background: `rgba(10,12,15, ${transparency})`,
    backdropFilter: 'blur(48px)',
    borderRadius: 3,
    boxShadow: '8px 8px 20px #00000040',
    border: `1px solid #ffffff50`,
  };
}
