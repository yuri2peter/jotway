import { passwordHasher } from '@local/common';
import {
  Stack,
  Stepper,
  Step,
  Typography,
  StepLabel,
  StepContent,
  TextField,
  Button,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import CentralBox from 'src/components/miscs/CentralBox';
import AuthFooter from 'src/components/app/miscs/AuthFooter';
import { lang2 } from 'src/components/app/utils';
import { navigate } from 'src/hacks/navigate';
import { snackbarMessage } from 'src/hacks/snackbarMessage';
import { glassStyle } from 'src/styles/utils';
import { requestApi } from 'src/utils/request';

const ResetPage: React.FC<{}> = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [codeState, setCodeState] = useState(0); // 验证码状态，0 未确定；1 需要验证；2 无须验证
  const [code, setCode] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const initState = useCallback(async () => {
    setCurrentStep(0);
    setCodeState(0);
    setCode('');
    setPassword1('');
    setPassword2('');
    const { isDefaultPassword } = await requestApi('auth/is-default-password');
    if (isDefaultPassword) {
      setCodeState(2);
    } else {
      setCodeState(1);
      await requestApi('auth/apply-reset-code');
    }
  }, []);
  const handleSubmitStep0 = useCallback(async () => {
    try {
      const { verified, error } = await requestApi('auth/verify-reset-code', {
        code,
      });
      if (verified) {
        snackbarMessage(
          lang2('验证成功', 'Verification successful.'),
          'success'
        );
        setCurrentStep(1);
      } else {
        snackbarMessage(
          error || lang2('验证码错误', 'Verification failed.'),
          'error'
        );
      }
    } catch {
      console.error('verify-reset-code error');
    }
  }, [code]);
  const handleSubmitStep1 = useCallback(async () => {
    if (password1 !== password2) {
      snackbarMessage(
        lang2('两次输入密码不一致', 'The two passwords are not the same.'),
        'error'
      );
      return;
    }
    if (password1.length < 6 || password1.length > 32) {
      snackbarMessage(
        lang2('密码长度不正确', 'Password length is incorrect.'),
        'error'
      );
      return;
    }
    setCurrentStep(2);
  }, [password1, password2]);
  useEffect(() => {
    initState();
  }, [initState]);
  return (
    <CentralBox height={1}>
      <Stack
        spacing={6}
        alignItems={'center'}
        sx={{ ...glassStyle(), padding: 3 }}
      >
        <Typography color={'white'} variant="h4" textAlign={'center'}>
          {lang2('重置密码', 'Reset Password')}
        </Typography>
        <Stack spacing={2} width={'min(80vw, 300px)'}>
          <Stepper activeStep={currentStep} orientation="vertical">
            <Step>
              <StepLabel>{lang2('身份验证', 'Authentication')}</StepLabel>
              <StepContent>
                {codeState === 1 && (
                  <>
                    <TextField
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                      }}
                      placeholder={lang2('验证码', 'Verification Code')}
                      fullWidth
                      helperText={lang2(
                        '该验证码已在服务端控制台打印',
                        'This verification code has been printed on the server console.'
                      )}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSubmitStep0();
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleSubmitStep0}
                      sx={{
                        marginTop: 2,
                        boxShadow: 'none',
                        textTransform: 'none',
                      }}
                    >
                      {lang2('提交', 'Submit')}
                    </Button>
                  </>
                )}
                {codeState === 2 && (
                  <>
                    <Typography color={'#fff'}>
                      {lang2(
                        '检测到默认密码，请立即修改密码',
                        'Detected the default password. Please change it immediately.'
                      )}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={async () => {
                        setCurrentStep(1);
                      }}
                      sx={{
                        marginTop: 2,
                        boxShadow: 'none',
                        textTransform: 'none',
                      }}
                    >
                      {lang2('确定', 'Confirm')}
                    </Button>
                  </>
                )}
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    navigate('/');
                  }}
                  sx={{
                    marginTop: 2,
                  }}
                >
                  {lang2('返回主页', 'Back to Home Page')}
                </Button>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>{lang2('设置新密码', 'Set New Password')}</StepLabel>
              <StepContent>
                <TextField
                  autoFocus
                  placeholder={lang2('输入密码', 'Input Password')}
                  fullWidth
                  type="password"
                  value={password1}
                  onChange={(e) => {
                    setPassword1(e.target.value);
                  }}
                  helperText={
                    lang2('当前密码长度: ', 'Password length: ') +
                    password1.length
                  }
                />
                <TextField
                  placeholder={lang2('再次输入', 'Repeat Password')}
                  fullWidth
                  type="password"
                  value={password2}
                  onChange={(e) => {
                    setPassword2(e.target.value);
                  }}
                  sx={{
                    marginTop: 2,
                  }}
                  helperText={lang2(
                    '密码长度不少于6位，不超过32位',
                    'Password length at least 6, not more than 32.'
                  )}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmitStep1();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSubmitStep1}
                  sx={{
                    marginTop: 2,
                    boxShadow: 'none',
                    textTransform: 'none',
                  }}
                >
                  {lang2('提交', 'Submit')}
                </Button>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>{lang2('确认', 'Confirm')}</StepLabel>
              <StepContent>
                <Typography color={'#fff'} align="center" mb={3}>
                  {lang2(
                    '确认执行密码重置？',
                    'Are you sure to reset the password?'
                  )}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={async () => {
                    try {
                      const { error } = await requestApi(
                        'auth/reset-password',
                        {
                          code,
                          password: passwordHasher(password1),
                        }
                      );
                      if (error) {
                        snackbarMessage(error, 'error');
                      } else {
                        snackbarMessage(
                          lang2(
                            '重置成功，请重新登录',
                            'Reset successfully. Please log in again.'
                          ),
                          'success'
                        );
                        navigate('/login');
                      }
                    } catch {
                      console.error('reset password failed');
                    }
                  }}
                >
                  {lang2('确认', 'Confirm')}
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    initState();
                  }}
                  sx={{
                    marginTop: 2,
                  }}
                >
                  {lang2('取消', 'Cancel')}
                </Button>
              </StepContent>
            </Step>
          </Stepper>
        </Stack>
        <AuthFooter />
      </Stack>
    </CentralBox>
  );
};

export default ResetPage;
