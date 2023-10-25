import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import CentralBox from 'src/components/miscs/CentralBox';
import AuthFooter from 'src/components/app/miscs/AuthFooter';
import { lang } from 'src/components/app/utils';
import { login } from 'src/store/state/actions/auth';
import { glassStyle } from 'src/styles/utils';

const LoginPage: React.FC<{}> = () => {
  const [password, setPassword] = useState('');
  const handleSubmit = useCallback(() => {
    login(password);
  }, [password]);
  return (
    <CentralBox height={1}>
      <Stack
        spacing={6}
        alignItems={'center'}
        sx={{ ...glassStyle(), padding: 3 }}
      >
        <Typography color={'white'} variant="h4" textAlign={'center'}>
          JOTWAY
        </Typography>
        <Stack spacing={2}>
          <input hidden name={'username'} value="Jotway Admin" readOnly />
          <TextField
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder={lang('授权码', 'Auth Code')}
            autoFocus
            fullWidth
            type="password"
            sx={{
              borderRadius: 1,
              overflow: 'hidden',
            }}
            inputProps={{
              style: {
                textAlign: 'center',
              },
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />
          <Button
            variant="contained"
            size={'medium'}
            fullWidth
            onClick={handleSubmit}
            sx={{
              borderRadius: 1,
              overflow: 'hidden',
              boxShadow: 'none',
              textTransform: 'none',
              fontSize: 16,
            }}
          >
            {lang('解锁', 'Unlock')}
          </Button>
          {lang(
            <Typography variant="body1" textAlign={'center'} fontSize={14}>
              忘记密码？点击<Link to={'/reset-password'}>这里</Link>
            </Typography>,
            <Typography variant="body1" textAlign={'center'} fontSize={14}>
              Forgot your password? Click
              <Link to={'/reset-password'}> here</Link>
            </Typography>
          )}
        </Stack>
        <AuthFooter />
      </Stack>
    </CentralBox>
  );
};

export default LoginPage;
