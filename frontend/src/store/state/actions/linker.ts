import { Linker, linkerSchema } from '@local/common';
import { changeStore, getStore } from '..';
import { cloneDeep, now } from 'lodash';
import { requestApi } from 'src/utils/request';
import { z } from 'zod';
import { calcLinkerOpenUrl } from 'src/components/app/utils';

export function openLinkerForm(linker: Linker, create = false) {
  const obj = cloneDeep(linker);
  changeStore((d) => {
    d.linkerForm.open = true;
    d.linkerForm.linker = obj;
    d.linkerForm.create = create;
  });
}

export function closeLinkerForm() {
  changeStore((d) => {
    d.linkerForm.open = false;
  });
}

export async function saveLinker() {
  const { linker, create } = getStore().linkerForm;
  await requestApi('linker/upsert', { ...linker, updatedAt: now() });
  await fetchLinker(linker.id);
  changeStore((d) => {
    d.linkerForm.open = false;
  });
  // 如果是新建笔记，自动打开编辑界面
  if (linker.article && create) {
    await openLinker(linker);
  }
}

// 传入一个linker对象，直接更新
export async function saveLinkerDirectly(linker: Linker) {
  await requestApi('linker/upsert', { ...linker, updatedAt: now() });
  await fetchLinker(linker.id);
}

export async function openLinker(linker: Linker) {
  window.open(calcLinkerOpenUrl(linker), '_blank');
  await updateAccessCount(linker.id);
}

export async function fetchLinker(id: string) {
  const { linker } = await requestApi('linker/get', { id });
  if (linker) {
    const linkerParsed = linkerSchema.parse(linker);
    changeStore((d) => {
      const prev = d.linkers.find((l) => l.id === linkerParsed.id);
      if (prev) {
        Object.assign(prev, linkerParsed);
      } else {
        d.linkers.push(linkerParsed);
      }
    });
  }
}

export async function fetchLinkers() {
  const linkers = await requestApi(
    'linker/list',
    getStore().linkers.map((t) => [t.id, t.updatedAt])
  );
  const parsedLinkers = z
    .array(z.union([z.string(), linkerSchema]))
    .parse(linkers);
  const prevLinkers = getStore().linkers;
  const newLinkers = parsedLinkers.map((t) => {
    if (typeof t === 'string') {
      return prevLinkers.find((l) => l.id === t);
    } else {
      return t;
    }
  });
  changeStore((d) => {
    d.linkers = newLinkers.filter(Boolean);
  });
}

export async function deleteLinker(id: string) {
  await requestApi('linker/delete', { id });
  changeStore((d) => {
    d.linkers = d.linkers.filter((l) => l.id !== id);
  });
}

// 记录一次访问计数
export async function updateAccessCount(id: string) {
  await requestApi('linker/access-count', { id });
  await fetchLinker(id);
}

// 普通linker转笔记
export async function transToArticle(id: string) {
  await requestApi('linker/trans-to-article', { id });
}

// 设置linker的pin属性
export async function setPin(linker: Linker, pin: boolean) {
  saveLinkerDirectly({ ...linker, pin });
}
