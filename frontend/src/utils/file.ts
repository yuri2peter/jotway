export function uploadFileFromLocal(): Promise<File> {
  return new Promise((resolve, reject) => {
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
            reject('cancelled upload');
          }
        }, 1000);
      },
      { once: true }
    );
    elInput.onchange = () => {
      fileCancle = false;
      const file = elInput?.files?.[0];
      if (file) {
        resolve(file);
      } else {
        reject('cancelled upload');
      }
      setTimeout(() => {
        document.body.removeChild(elInput);
      }, 0);
    };
    elInput.click();
  });
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file, 'utf8');
    reader.onload = async function (e) {
      const content = e.target?.result || '';
      resolve(content as string);
    };
  });
}
