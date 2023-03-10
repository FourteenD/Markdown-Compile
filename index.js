// markdomn-compile


const fs = require('fs');
const path = require('path');
const md = fs.readFileSync(path.resolve(__dirname, 'test.md'), 'utf-8');

// 规则
const rules = [
  // 标题
  {
    name: 'heading',
    reg: /^# .+$/gm,
    replace: (content) => {
      const level = content.match(/^#+/)[0].length;
      const text = content.replace(/^#+/, '');
      return `<h${level}>${text}</h${level}>`;
    }
  },
  // 粗体
  {
    name: 'bold',
    reg: /\*\*[^*]+\*\*/g,
    replace: (content) => {
      const text = content.replace(/\*\*/g, '');
      return `<strong>${text}</strong>`;
    }
  },
  // 斜体
  {
    name: 'italic',
    reg: /\*[^*]+\*/g,
    replace: (content) => {
      const text = content.replace(/\*/g, '');
      return `<em>${text}</em>`;
    }
  },
  // 链接
  {
    name: 'link',
    reg: /\[[^\]]+\]\([^\)]+\)/g,
    replace: (content) => {
      const text = content.match(/\[([^\]]+)\]/)[1];
      const href = content.match(/\(([^\)]+)\)/)[1];
      return `<a href="${href}">${text}</a>`;
    }
  },
  // 代码
  {
    name: 'code',
    reg: /`[^`]+`/g,
    replace: (content) => {
      const text = content.replace(/`/g, '');
      return `<code>${text}</code>`;
    }
  },
  // 图片
  {
    name: 'image',
    reg: /!\[[^\]]+\]\([^\)]+\)/g,
    replace: (content) => {
      const text = content.match(/\[([^\]]+)\]/)[1];
      const src = content.match(/\(([^\)]+)\)/)[1];
      return `<img src="${src}" alt="${text}">`;
    }
  },
  // 列表
  {
    name: 'list',
    reg: /^(\s*)(\d+\.|-) .+$/gm,
    replace: (content) => {
      const space = content.match(/^(\s*)/)[0];
      const level = space.length / 2;
      const text = content.replace(/^(\s*)(\d+\.|-) /, '');
      const isOrder = content.match(/^(\s*)(\d+\.|-)/)[2] === '.';
      const tag = isOrder ? 'ol' : 'ul';
      return `<${tag} level="${level}"><li>${text}</li></${tag}>`;
    }
  },
  // 段落
  {
    name: 'paragraph',
    reg: /^[^#*!-].+$/gm,
    replace: (content) => {
      return `<p>${content}</p>`;
    }
  },
];

// 词法解析和
function lexer(md) {
  const tokens = [];
  let index = 0;
  while (index < md.length) {
    let matched = false;
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      const match = md.slice(index).match(rule.reg);
      if (match) {
        matched = true;
        const token = {
          type: rule.name,
          content: match[0],
        };
        tokens.push(token);
        index += match[0].length;
        break;
      }
    }
    if (!matched) {
      index++;
    }
  }
  return tokens;
}

function parser(tokens) {
  let html = '';
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    for (let j = 0; j < rules.length; j++) {
      const rule = rules[j];
      if (rule.name === token.type) {
        html += rule.replace(token.content);
      }
    }
  }
  return html;
}

function compiler(md) {
  const tokens = lexer(md);
  const html = parser(tokens);
  return html;
}

fs.writeFileSync(path.resolve(__dirname, 'test.html'), compiler(md));
