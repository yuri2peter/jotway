/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function createUploader({ cm, dropEl, lang }) {
  function insertLinkToEditor({ cm, mimetype, newFilename, originalFilename }) {
    let content = `[${originalFilename}](/uploads/${newFilename})`;
    if (mimetype.startsWith('image/')) {
      content = `![${originalFilename}](/uploads/${newFilename})`;
    }
    cm.replaceSelection(content);
  }

  function defaultHandleProgress(p = '0') {
    // console.log(`File Upload: ${p}%`);
  }

  function updateUploadInfo({ name, progress }) {
    $('#upload-info-box').addClass('show');
    $('#upload-progress').text(`${name} ${progress}%`);
  }

  function closeUploadInfo() {
    $('#upload-info-box').removeClass('show');
  }

  function uploadFileToServer(file, onProgress = defaultHandleProgress) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload', true);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = ((event.loaded / event.total) * 100).toFixed(2);
          onProgress(percent);
          updateUploadInfo({ name: file.name, progress: percent });
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr.statusText);
        }
        closeUploadInfo();
      };
      xhr.send(formData);
    });
  }

  function handleUploaded({ mimetype, newFilename, originalFilename }) {
    insertLinkToEditor({
      cm,
      mimetype,
      newFilename,
      originalFilename,
    });
  }

  const elDrop = document.querySelector(dropEl);
  if (!elDrop) {
    console.warn(lang('找不到上传DOM.', 'Can not find upload DOM.'));
    return;
  }

  elDrop.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    elDrop.classList.add('drop');
  });

  elDrop.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target === elDrop) {
      elDrop.classList.remove('drop');
    }
  });

  // 在文件拖放时处理
  elDrop.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    elDrop.classList.remove('drop');
    const files = e.dataTransfer.files;
    const file = files[0];
    if (file) {
      uploadFileToServer(file).then(handleUploaded);
    }
  });

  // 监听粘贴文件、图片、html
  elDrop.addEventListener('paste', (e) => {
    // hacky. 如果查询到有dialog（搜索），忽略
    if ($('.CodeMirror-dialog').length > 0) {
      return;
    }

    // 如果是文件
    const files = e.clipboardData.files;
    const file = files[0];
    if (file) {
      e.preventDefault();
      e.stopPropagation();
      uploadFileToServer(file).then(handleUploaded);
    }
  });

  return {
    singleFileUpload: () => {
      let fileCancle = true;
      // Create a hidden input element and open the file picker dialog
      const elInput = document.createElement('input');
      elInput.type = 'file';
      elInput.style.display = 'none';
      document.body.append(elInput); // For iOS compatibility, must be mounted to body
      // Listen for cancel actions
      window.addEventListener(
        'focus',
        () => {
          setTimeout(() => {
            if (fileCancle) {
              // Cancel handing logic
            }
          }, 1000);
        },
        { once: true }
      );
      elInput.onchange = () => {
        fileCancle = false;
        const file = elInput.files[0];
        if (file) {
          uploadFileToServer(file).then(handleUploaded);
        }
        setTimeout(() => {
          document.body.removeChild(elInput);
        }, 0);
      };
      elInput.click();
    },
  };
}
