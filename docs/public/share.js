function share(hook, vm) {
  function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
      return window.clipboardData.setData("Text", text);
    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
      var textarea = document.createElement("textarea");
      textarea.textContent = text;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        return document.execCommand("copy");
      } catch (ex) {
        console.warn("Copy to clipboard failed.", ex);
        return prompt("Copy to clipboard: Ctrl+C, Enter", text);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  }
  hook.ready(function () {

    var article = document.getElementById("main").parentElement;
    if (!article) {
      return;
    }
    var href = document.createElement("a");
    href.href = "javascript:;";
    href.text = "复制地址";
    href.className = "share app-name-link";
    href.onclick = function () {
      var url = "https://igix.io/index.html" + window.location.hash;
      copyToClipboard(url);
      href.text = "已复制";
      window.setTimeout(() => {
        href.text = "复制地址";
      }, 1500);
    };
    article.appendChild(href);
    console.log("ready");
  });
  hook.afterEach(function (html, next) {
    var supriseElement = document.getElementById("suprise");
    if (supriseElement) {
      var request = ajax({
        method: 'get',
        url: 'https://v1.hitokoto.cn/'
      });

      request.then(function (response) {
        if (response && response.hitokoto) {
          supriseElement.innerText = response.hitokoto;
        }
      });
    }
    next(html);
  });
}
window.$docsify = window.$docsify || {};
window.$docsify.plugins = [share].concat(window.$docsify.plugins || []);