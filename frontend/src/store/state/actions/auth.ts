import { passwordHasher } from '@local/common';
import { dialogConfirm } from 'src/hacks/comfirm';
import { snackbarMessage } from 'src/hacks/snackbarMessage';
import { requestApi } from 'src/utils/request';

export function logout() {
  dialogConfirm('确认操作', '您确定要退出登录吗？').then(() => {
    location.href = '/api/auth/logout-admin';
  });
}

export async function login(password: string) {
  const passHashed = passwordHasher(password);
  const { error } = await requestApi('auth/login-admin', {
    password: passHashed,
  });
  if (error) {
    snackbarMessage(error, 'error');
  } else {
    location.href =
      '/api/auth/login-admin?password=' + passwordHasher(password);
  }
}
