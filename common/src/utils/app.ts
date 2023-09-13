import md5 from 'md5';

export const defaultPassword = passwordHasher('123456'); // a523e3e2d39f4faaeb04909657b34dbc

// 前端传输密码前需要用此函数进行hash。
export function passwordHasher(password: string) {
  return md5(password + 'jotway');
}
