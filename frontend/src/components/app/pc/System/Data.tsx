import { Box, ButtonBase, Grid, Stack, Typography } from '@mui/material';
import { saveAs } from 'file-saver';
import React from 'react';
import { Bookmarks, bookmarksSchema, getNewLinker } from '@local/common';
import CentralBox from 'src/components/CentralBox';
import { snackbarMessage } from 'src/hacks/snackbarMessage';
import { readFileAsText, uploadFileFromLocal } from 'src/utils/file';
import { requestApi } from 'src/utils/request';
import { dialogConfirm } from 'src/hacks/comfirm';
import { getStore } from 'src/store/state';
import { checkImageSrc, getAbsoluteUrl, sleep } from 'src/utils/miscs';
import { saveLinkerDirectly } from 'src/store/state/actions/linker';
import { parseUrl } from 'src/api/utils';
import { now, uniqBy } from 'lodash';
import { nanoid } from 'nanoid';
import { restrictedMessage } from 'src/hacks/restrictedMessage';
import { lang } from '../../utils';

const DataSection: React.FC<{}> = () => {
  return (
    <Grid container spacing={2}>
      <ActionBlock
        title={lang('导入书签', 'Import Bookmarks')}
        desc={lang(
          '从浏览器书签文件中导入数据',
          'Import data from browser bookmark file.'
        )}
        onClick={importBookmarks}
      />
      <ActionBlock
        title={lang('图标清理', 'Clean Icons')}
        desc={lang(
          '检查所有图标的可访问性，清除不可用的图标',
          'Check the accessibility of all icons.'
        )}
        onClick={cleanIcons}
      />
      <ActionBlock
        title={lang('图标解析', 'Resolve Icons')}
        desc={lang(
          '检查所有空图标，尝试从互联网解析图标链接',
          'Resolve empty icon links from the internet.'
        )}
        onClick={genIcons}
      />
      <ActionBlock
        title={lang('文件清理', 'Clear Uploads')}
        desc={lang(
          '检查所有已上传的文件，清理未被引用的文件',
          'Review all uploaded files and remove unreferenced ones.'
        )}
        onClick={clearUploads}
      />
      <ActionBlock
        title={lang('导出数据', 'Export Data')}
        desc={lang(
          '导出系统的全部数据，不包括上传的文件',
          'Export all system data, excluding uploaded files.'
        )}
        onClick={exportData}
      />
      <ActionBlock
        title={lang('导入数据', 'Import Data')}
        desc={lang(
          '导入外部数据，将覆盖系统当前数据',
          'It will overwrite the current system data.'
        )}
        onClick={importData}
      />
      <ActionBlock
        title={lang('重置数据', 'Reset Data')}
        desc={lang(
          '将系统恢复到初始状态，当前所有数据将被清空',
          'All current data will be erased.'
        )}
        onClick={resetData}
      />
    </Grid>
  );
};

const ActionBlock: React.FC<{
  title?: string;
  desc?: string;
  onClick?: () => void;
}> = ({ title = '', desc = '', onClick = () => {} }) => {
  return (
    <Grid item xs={3}>
      <ButtonBase
        onClick={onClick}
        sx={{
          borderRadius: 2,
          border: '1px solid #ffffff40',
          padding: 1,
          height: 150,
          transition: 'all 0.2s',
          '&:hover': {
            background: '#ffffff20',
            borderColor: '#ffffff80',
          },
        }}
      >
        <CentralBox height={1}>
          <Stack spacing={1}>
            <Typography variant="body1">{title}</Typography>
            <Box height={72}>
              <Typography variant="caption" color={'text.secondary'}>
                {desc}
              </Typography>
            </Box>
          </Stack>
        </CentralBox>
      </ButtonBase>
    </Grid>
  );
};

async function importBookmarks() {
  const file = await uploadFileFromLocal();
  try {
    const text = await readFileAsText(file);
    const data = await requestApi('utils/parse-bookmarks', { text });
    const bookmarks = bookmarksSchema.parse(data);
    const links: {
      url: string;
      name: string;
      tags: string[];
    }[] = [];

    const ergodic = (bookmarks: Bookmarks, tags: string[] = []) => {
      bookmarks.forEach((b) => {
        if (b.type === 'folder') {
          ergodic(b.children, [...tags, b.name]);
        } else {
          links.push({
            url: b.href,
            name: b.name,
            tags,
          });
        }
      });
    };

    ergodic(bookmarks);
    const savedUrls = getStore().linkers.map((t) => t.url);
    const links1 = uniqBy(
      links.filter((t) => !savedUrls.includes(t.url)),
      'url'
    );
    if (links1.length === 0) {
      snackbarMessage(lang(`无可用对象`, 'No available objects.'), 'info');
      return;
    }
    dialogConfirm(
      lang(`确认操作`, 'Confirm'),
      lang(
        `检测到${links1.length}个不重复的对象，要要解析并添加到系统吗？`,
        `Detected ${links1.length} unique objects. Would you like to parse and add them to the system?`
      )
    )
      .then(async () => {
        restrictedMessage({
          open: true,
          title: lang('导入书签', 'Import Bookmarks'),
          content: lang('正在初始化....', 'Initializing...'),
          closeable: false,
        });
        let count = 0;
        const tasks = links1.map((link, i) =>
          (async () => {
            await sleep(i * 200);
            const { url, name, tags } = link;
            const { iconLink, description } = await parseUrl(url);
            await saveLinkerDirectly({
              ...getNewLinker(),
              desc: description || url,
              name,
              url: url,
              icon: iconLink,
              tags,
            });
            count++;
            restrictedMessage({
              content: `[${count} / ${links1.length}] ${name}`,
            });
          })()
        );
        await Promise.all(tasks);
        restrictedMessage({
          content: lang(
            `任务完成，已导入${count}个对象`,
            `Task completed. ${count} objects processed.`
          ),
          closeable: true,
        });
      })
      .catch(() => {
        console.log(lang('任务已取消', 'The task has been canceled.'));
      });
  } catch (error) {
    console.warn(error);
    snackbarMessage(
      lang(
        '导入失败，请选择正确的书签文件',
        'Import failed. Please select the correct bookmark file.'
      ),
      'error'
    );
  }
}

async function cleanIcons() {
  const linkers = getStore().linkers.filter((t) => !t.article && t.icon);
  restrictedMessage({
    open: true,
    title: lang('图标清理', 'Clean Icons'),
    content: lang(
      `正在检查，共${linkers.length}个对象，请稍候`,
      `Currently inspecting ${linkers.length} objects. Please wait.`
    ),
    closeable: false,
  });
  let count = 0;
  for (let i = 0; i < linkers.length; i++) {
    const l = linkers[i];
    restrictedMessage({
      content: `[${i + 1} / ${linkers.length}] ${l.name}`,
    });
    const pass = await checkImageSrc(getAbsoluteUrl(l.icon, l.url));
    if (!pass) {
      count++;
      await saveLinkerDirectly({
        ...l,
        icon: '',
      });
    }
  }
  await sleep(1000);
  restrictedMessage({
    content: lang(
      `任务完成。已处理${count}个对象`,
      `Task completed. ${count} objects processed.`
    ),
    closeable: true,
  });
}

async function genIcons() {
  const settings = getStore().settings;
  const linkers = getStore().linkers.filter((t) => !t.article && !t.icon);
  restrictedMessage({
    open: true,
    title: lang('图标解析', 'Resolve Icons'),
    content: lang(
      `正在检查，共${linkers.length}个对象，请稍候`,
      `Currently inspecting ${linkers.length} objects. Please wait.`
    ),
    closeable: false,
  });
  let countSum = 0;
  let countParsed = 0;
  const tasks = linkers.map((l, i) =>
    (async () => {
      await sleep(i * 200);
      const { iconLink } = await parseUrl(
        l.url,
        settings.htmlParseServer,
        settings.htmlParseTimeoutSeconds * 1000
      );
      if (iconLink) {
        countParsed++;
        await saveLinkerDirectly({
          ...l,
          icon: iconLink,
        });
      }
      countSum++;
      restrictedMessage({
        content: `[${countSum} / ${linkers.length}] ${l.name}`,
      });
    })()
  );
  await Promise.all(tasks);
  restrictedMessage({
    content: lang(
      `任务完成。已处理${countParsed}个对象`,
      `Task completed. ${countParsed} objects processed.`
    ),
    closeable: true,
  });
}

async function exportData() {
  const data = await requestApi('system/export-data');
  const file = new File([JSON.stringify(data)], 'jotway_record.json', {
    type: 'text/plain;charset=utf-8',
  });
  saveAs(file);
  snackbarMessage(lang('操作成功', 'Operation successful.'), 'success');
}

async function importData() {
  const file = await uploadFileFromLocal();
  const text = await readFileAsText(file);
  try {
    const rawData = JSON.parse(text);
    await requestApi('system/import-data', rawData as any);
    alert(
      lang('操作成功，请重新登录', 'Operation successful, please log in again.')
    );
    location.href = '/login';
  } catch (error) {
    console.warn(error);
    snackbarMessage(
      lang(
        '操作失败，文件内容无法解析',
        'Operation failed, file content cannot be parsed.'
      ),
      'error'
    );
  }
}

function resetData() {
  dialogConfirm(
    lang('危险操作', 'Danger'),
    lang('确认要重置数据吗?', 'Do you confirm to reset the data?')
  ).then(async () => {
    try {
      await requestApi('system/reset-data');
      alert(
        lang(
          '操作成功，请用初始密码重新登录',
          'Operation successful. Please log in again using the initial password.'
        )
      );
      location.href = '/login';
    } catch (error) {
      console.warn(error);
      snackbarMessage(lang('操作失败', 'Operation failed.'), 'error');
    }
  });
}

function clearUploads() {
  dialogConfirm(
    lang('危险操作', 'Danger'),
    lang(
      '执行此操作将删除所有未被其他地方引用的文件。如果您之后还原了包含这些文件的历史数据，这些文件可能会丢失并无法使用。确认继续执行操作吗？',
      'Performing this action will delete all files that are not referenced elsewhere. If you later restore the historical data containing these files, these files may be lost and unusable. Are you sure you want to proceed with the operation?'
    )
  ).then(async () => {
    try {
      const { cleanResults } = await requestApi('system/clear-uploads');
      snackbarMessage(
        lang(
          `任务完成。已处理${cleanResults.length}个对象`,
          `Task completed. ${cleanResults.length} objects processed.`
        ),
        'success'
      );
    } catch (error) {
      console.warn(error);
      snackbarMessage(lang('操作失败', 'Operation failed.'), 'error');
    }
  });
}

export default DataSection;
