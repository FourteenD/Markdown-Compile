// markdomn-compile

// 1. 读取文件
const fs = require('fs');
const path = require('path');
const md = fs.readFileSync(path.resolve(__dirname, 'test.md'), 'utf-8');

// 2.规则
const rules = [
  // 标题
  {
    name: 'header',
    reg: /^#{1,6}\s+(.*)$/,
    replace: (match, value) => {
      const len = match.split('')[0].length;
      return `<h${len}>${value}</h${len}>`;
    },
  },
  // 粗体
  {
    name: 'bold',
    reg: /\*\*(.*)\*\*/,
    replace: (match, value) => {
      return `<strong>${value}</strong>`;
    }
  },
  // 斜体
  {
    name: 'italic',
    reg: /\*(.*)\*/,
    replace: (match, value) => {
      return `<em>${value}</em>`;
    }
  },
  // 删除线
  {
    name: 'del',
    reg: /~~(.*)~~/,
    replace: (match, value) => {
      return `<del>${value}</del>`;
    }
  },
  // 无序列表
  {
    name: 'ul',
    reg: /^(\s*)(\*|-|\+)\s+(.*)$/,
    replace: (match, space, symbol, value) => {
      return `<ul>\n${space}<li>${value}</li>\n${space}</ul>`;
    }
  },
  // 有序列表
  {
    name: 'ol',
    reg: /^(\s*)\d+\.\s+(.*)$/,
    replace: (match, space, value) => {
      return `<ol>\n${space}<li>${value}</li>\n${space}</ol>`;
    }
  },
  // 代码块
  {
    name: 'code',
    reg: /^```(.*)\n([\s\S]*)\n```$/,
    replace: (match, language, value) => {
      return `<pre><code class="language-${language}">${value}</code></pre>`;
    }
  },
  // 行内代码
  {
    name: 'inlineCode',
    reg: /`(.*)`/,
    replace: (match, value) => {
      return `<code>${value}</code>`;
    }
  },
  // 链接
  {
    name: 'link',
    reg: /\[(.*)\]\((.*)\)/,
    replace: (match, text, url) => {
      return `<a href="${url}">${text}</a>`;
    }
  },
  // 图片
  {
    name: 'image',
    reg: /!\[(.*)\]\((.*)\)/,
    replace: (match, alt, url) => {
      return `<img src="${url}" alt="${alt}">`;
    }
  },
  // 换行
  {
    name: 'br',
    reg: /\n/,
    replace: () => {
      return '<br>';
    }
  },
  // 段落
  {
    name: 'p',
    reg: /^((?!<h|<ul|<ol|<pre|<img|<br).)*$/,
    replace: (match) => {
      return `<p>${match}</p>`;
    }
  },
];

// 3.转换
const result = rules.reduce((prev, rule) => {
  return prev.replace(rule.reg, rule.replace);
}, md);

// 4.输出
fs.writeFileSync(path.resolve(__dirname, 'test.html'), result);
