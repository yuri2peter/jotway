/*!
 * Link dialog plugin for Editor.md
 *
 * @file        parse-html-dialog.js
 * @author      yuri2
 * @version     1.0.0
 * @updateTime  2023-09
 */

(function () {
  var factory = function (exports) {
    var pluginName = 'parse-html-dialog';
    const elId = 'editor-parse-html-dialog-plugin-textarea';
    const isEn = localStorage.getItem('langType') === 'en';
    function myLang(zh, en) {
      return isEn ? en : zh;
    }

    exports.fn.parseHtmlDialog = function () {
      var _this = this;
      var cm = this.cm;
      var editor = this.editor;
      var settings = this.settings;
      var selection = cm.getSelection();
      var lang = this.lang;
      var classPrefix = this.classPrefix;
      var dialogName = classPrefix + pluginName,
        dialog;

      cm.focus();

      if (editor.find('.' + dialogName).length > 0) {
        dialog = editor.find('.' + dialogName);
        dialog.find('[data-url]').val('http://');
        dialog.find('[data-title]').val(selection);

        this.dialogShowMask(dialog);
        this.dialogLockScreen();
        dialog.show();
      } else {
        var dialogHTML = `
  <div class="${classPrefix}form">
    <textarea id="${elId}" placeholder="${myLang(
          '请在此处粘贴HTML内容',
          'Paste HTML content here.'
        )}" value=""
      spellcheck="false"
      data-textarea
      style="width: 100%;height: 410px;resize: none;outline: none;border: 1px solid #ccc;" />
  </div>
`;

        dialog = this.createDialog({
          title: myLang('粘贴HTML内容', 'Parse HTML Content'),
          width: 460,
          height: 540,
          content: dialogHTML,
          mask: settings.dialogShowMask,
          drag: settings.dialogDraggable,
          lockScreen: settings.dialogLockScreen,
          maskStyle: {
            opacity: settings.dialogMaskOpacity,
            backgroundColor: settings.dialogMaskBgColor,
          },
          buttons: {
            enter: [
              lang.buttons.enter,
              function () {
                var str = $(`#${elId}`).val();
                cm.replaceSelection(str);
                this.hide().lockScreen(false).hideMask();
                return false;
              },
            ],

            cancel: [
              lang.buttons.cancel,
              function () {
                this.hide().lockScreen(false).hideMask();

                return false;
              },
            ],
          },
        });
        $(`#${elId}`).on('paste', (e) => {
          e.preventDefault();
          e.stopPropagation();
          let text = '';
          const html = e.originalEvent.clipboardData.getData('text/html');
          if (html) {
            const turndownService = new TurndownService();
            text = turndownService.turndown(html);
          } else {
            text = e.clipboardData.getData('text/plain');
          }
          $(`#${elId}`).val(text);
        });
      }
    };
  };

  // CommonJS/Node.js
  if (
    typeof require === 'function' &&
    typeof exports === 'object' &&
    typeof module === 'object'
  ) {
    module.exports = factory;
  } else if (typeof define === 'function') {
    // AMD/CMD/Sea.js
    if (define.amd) {
      // for Require.js

      define(['editormd'], function (editormd) {
        factory(editormd);
      });
    } else {
      // for Sea.js
      define(function (require) {
        var editormd = require('./../../editormd');
        factory(editormd);
      });
    }
  } else {
    factory(window.editormd);
  }
})();
