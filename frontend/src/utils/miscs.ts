import { FormikProps } from 'formik';
import lodash from 'lodash';
import { z } from 'zod';

// 连字符转驼峰
export function hyphen2Camel(str: string) {
  const re = /-(\w)/g;
  return str.replace(re, ($0, $1) => {
    return $1.toUpperCase();
  });
}

// 首字母改为大写
export function upperCaseFirst(str: string) {
  if (!str) {
    return '';
  }
  return str[0].toUpperCase() + str.slice(1, str.length);
}

// 树形图返回数据的nodeType对应的文字
export function nodeTypeToLabel(nodeType: string) {
  switch (nodeType) {
    case '1':
      return '';
    case '2':
      return '';
    default:
      return '';
  }
}

// 返回一个在当前运行时累加的id生成器
// usage: runtimeIdGenerator()();
function runtimeIdGenerator() {
  let id = 1;
  return () => {
    id += 1;
    return id;
  };
}
runtimeIdGenerator.gen = runtimeIdGenerator();

// 返回一个在当前浏览器实例累加的ID。
export function generateId() {
  return runtimeIdGenerator.gen();
}

// 针对Mui的表单组件，生成formik属性。减少样板代码
export function muiFormikPropsParser<T extends {}>(
  formik: FormikProps<T>,
  name: string,
  noDefaultStyles?: boolean
) {
  const props = {
    name,
    checked: lodash.get(formik.values, name),
    value: lodash.get(formik.values, name),
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error:
      lodash.get(formik.touched, name) &&
      Boolean(lodash.get(formik.errors, name)),
    helperText:
      lodash.get(formik.touched, name) && lodash.get(formik.errors, name),
  };
  if (!noDefaultStyles) {
    Object.assign(props, {
      fullsize: true,
      size: 'small',
    });
  }
  return props;
}

// 获取当前时间的总秒数
export function getCurrentTimeSeconds() {
  return Math.floor(new Date().getTime() / 1000);
}

// 对于小于0的数,取0
export function getZeroIfLessThanZero(num: number) {
  return num < 0 ? 0 : num;
}

// 等待
export function sleep(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

// 保留3位小数
export function fixNumber(num: number) {
  return Math.round(num * 1000) / 1000;
}

// 限制数字在某一范围内
export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

// 将键值对的键名转化为枚举约束
export function zodEnumFromObjKeys<K extends string>(
  obj: Record<K, any>
): z.ZodEnum<[K, ...K[]]> {
  const [firstKey, ...otherKeys] = Object.keys(obj) as K[];
  return z.enum([firstKey, ...otherKeys]);
}

// 生成适用于全屏背景的background属性值
export function bg(imageSrc = '/backgrounds/low-poly-grid-haikei.svg') {
  return `url(${imageSrc}) center/cover`;
}

// 根据baseUrl，获取完整的URL
export function getAbsoluteUrl(src: string, baseUrl = '') {
  const defaultSrc = '';
  if (!src) {
    return defaultSrc;
  }
  if (src.startsWith('http') || !baseUrl.startsWith('http')) {
    return src;
  }
  try {
    return new URL(src, baseUrl).href;
  } catch (error) {
    return defaultSrc;
  }
}

// 检查图片src的可访问性
export function checkImageSrc(src: string): Promise<boolean> {
  const image = new Image();
  image.src = src;
  return new Promise((resolve) => {
    image.onload = () => {
      resolve(true);
    };
    image.onerror = () => {
      resolve(false);
    };
  });
}

// 仿windows重命名，如果有重复项，自动添加序号。ABC，ABC(1)，ABC(2)...
export function autoRenameWithIndex(newName: string, localNames: string[]) {
  const reg = /([\w\W]*)\((\d+)\)$/;
  const r1 = reg.exec(newName);
  const pureName1 = r1?.[1] || newName;
  let maxIndex = 0;
  localNames.forEach((t) => {
    const r2 = reg.exec(t);
    const pureName2 = r2?.[1] || t;
    let index2 = 0;
    if (pureName2 === pureName1) {
      index2 = Number(r2?.[2] || 0) + 1;
    }
    if (index2 > maxIndex) {
      maxIndex = index2;
    }
  });
  const index1 = maxIndex + 1;
  return index1 > 1 ? `${pureName1}(${index1 - 1})` : pureName1;
}
