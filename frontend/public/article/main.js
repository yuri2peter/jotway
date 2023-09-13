$(function () {
  const isMobile = detectMobile();
  const tabSize = 2;
  let articleId = '';
  let articleContent = '';
  let articleName = '';
  const isEn = localStorage.getItem('langType') === 'en';

  function lang(zh, en) {
    return isEn ? en : zh;
  }

  function onEditingChanged(editing = false) {
    document.title = (editing ? '* ' : '') + articleName;
    window.onbeforeunload = editing
      ? () => lang('正在保存，请勿关闭', 'Saving, please do not close.')
      : null;
  }

  async function fetchArticleLinker() {
    // 从url的query中获取id
    const { id } = parseQueries();
    articleId = id;

    // 拉取数据
    const {
      data: {
        linker: { name, content },
      },
    } = await axios.post('/api/linker/get', { id }).catch((e) => {
      alert(lang('请先登录', 'Please login'));
      location.href = '/login';
    });
    articleContent = content;
    articleName = name;
    onEditingChanged(false);
  }

  function tryUseEnglish() {
    return new Promise((resolve) => {
      if (isEn) {
        editormd.loadScript('./languages/en', resolve);
      } else {
        resolve();
      }
    });
  }

  function initEditor() {
    let uploader = null;
    editormd.emoji = {
      path: './plugins/emoji-dialog/emoji/',
      ext: '.png',
    };
    editor = editormd('el-editormd', {
      watch: !isMobile,
      value: articleContent,
      width: '100%',
      height: '100%',
      syncScrolling: true,
      indentWithTabs: false,
      tabSize: tabSize,
      atLink: false,
      emoji: true,
      codeFold: true,
      placeholder: '',
      fontSize: '14px',
      tex: true, // 开启科学公式TeX语言支持，默认关闭
      flowChart: true, // 开启流程图支持，默认关闭
      sequenceDiagram: true, // 开启时序/序列图支持，默认关闭,
      tocContainer: '#tbtn-toc-container',
      toolbarIcons: function () {
        if (isMobile) {
          return [
            'h1',
            'h2',
            'list-ul',
            'list-ol',
            '|',
            'emoji',
            'fileUpload',
            'preview',
          ];
        }
        return [
          'undo',
          'redo',
          '|',
          'bold',
          'del',
          'italic',
          'quote',
          'code',
          '|',
          'h1',
          'h2',
          'h3',
          'h4',
          '|',
          'list-ul',
          'list-ol',
          'hr',
          '|',
          'code-block',
          'table',
          'link',
          'image',
          'emoji',
          'fileUpload',
          'parseHtml',
          '|',
          'preview',
          'watch',
          'directory',
        ];
      },
      toolbarIconsClass: {
        fileUpload: 'fa-upload',
        parseHtml: 'fa-html5',
      },
      toolbarCustomIcons: {
        directory: `
        <a href="javascript:;" title="${lang(
          '目录',
          'Directory'
        )}" unselectable="on">
          <i id="btn-directory" class="fa  fa-list-alt" name="directory" unselectable="on">
            <div id="tbtn-toc-container" title=""></div>
          </i>
        </a>`,
        parseHtml: `
        <a href="javascript:;" title="${lang(
          '粘贴HTML内容',
          'Parse HTML Content'
        )}" unselectable="on">
          <i class="fa fa-html5" name="parseHtml" unselectable="on"></i>
        </a>`,
      },
      toolbarHandlers: {
        fileUpload: () => {
          uploader.singleFileUpload();
        },
        parseHtml() {
          this.parseHtmlDialog();
        },
      },
      lang: {
        toolbar: {
          fileUpload: lang('上传文件', 'Upload File'),
        },
      },
      onload: () => {
        uploader = createUploader({
          cm: editor.cm,
          dropEl: '.CodeMirror',
          lang,
        });
        $('#tbtn-toc-container').click((e) => {
          e.stopPropagation();
        });
        // cm的缩进自定义配置
        editor.cm.setOption('indentUnit', tabSize);
        editor.cm.setOption('extraKeys', {
          Tab: (cm) => {
            if (cm.somethingSelected()) {
              cm.indentSelection('add');
            } else {
              cm.replaceSelection(
                (cm.getOption
                  ? '\t'
                  : Array(cm.getOption('indentUnit') + 1).join(' '),
                'end',
                Array.from({ length: tabSize })
                  .map(() => ' ')
                  .join(''))
              );
            }
          },
          'Shift-Tab': (cm) => {
            if (cm.somethingSelected()) {
              cm.indentSelection('subtract');
            } else {
              const cursor = cm.getCursor();
              cm.indentLine(cursor.line, 'subtract');
            }
          },
        });
      },
    });

    const handleChangeDebounced = debounce(handleChange, 200);
    editor.on('change', () => {
      onEditingChanged(true);
      handleChangeDebounced(editor.getMarkdown());
    });
    return editor;
  }

  function initPreview() {
    const text = marked.parse(articleContent);
    $('#preview').html(text);
  }

  function parseQueries(url) {
    const url1 = url || window.document.location.search;
    let u = url1.split('?');
    if (typeof u[1] == 'string') {
      u = u[1].split('&');
      const get = {};
      for (let i in u) {
        const j = u[i].split('=');
        get[j[0]] = decodeURIComponent(j[1]);
      }
      return get;
    } else {
      return {};
    }
  }

  async function handleChange(text) {
    await axios
      .post('/api/linker/update-content', {
        id: articleId,
        content: text,
      })
      .then(() => {
        onEditingChanged();
      });
  }

  function debounce(func, delay) {
    let timerId;

    return function (...args) {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  function detectMobile() {
    const screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    return screenWidth < 768;
  }

  async function main() {
    await fetchArticleLinker();
    await tryUseEnglish();
    initEditor();
  }

  main();
});
