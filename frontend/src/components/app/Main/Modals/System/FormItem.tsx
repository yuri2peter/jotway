import { Box, Stack, Typography } from '@mui/material';
import RowStack from 'src/components/miscs/RowStack';

const FormItem: React.FC<{
  title: string;
  children: React.ReactNode;
  vertical?: boolean;
}> = ({ title, children, vertical = false }) => {
  if (vertical) {
    return (
      <Stack spacing={1} alignItems={'stretch'}>
        <Typography color={'text.secondary'}>{title}</Typography>
        <Box>{children}</Box>
      </Stack>
    );
  }
  return (
    <RowStack alignItems={'flex-start'}>
      <Typography
        sx={{ paddingTop: 1, width: '8em', flexGrow: 0, flexShrink: 0 }}
      >
        {title}:{' '}
      </Typography>
      <Box flexGrow={1}>{children}</Box>
    </RowStack>
  );
};
export default FormItem;
