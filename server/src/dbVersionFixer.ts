// 对版本不一致的数据文件进行修复

export function fixer(
  version: number,
  changeData: (recipe: (base: unknown) => void) => void
) {
  if (version === 3) {
    changeData(v3ToV4);
    fixer(4, changeData);
    return;
  }
}

function v3ToV4(data: any) {}
