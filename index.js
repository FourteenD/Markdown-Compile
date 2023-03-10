// markdomn-compile


const fs = require('fs');
const path = require('path');
const md = fs.readFileSync(path.resolve(__dirname, 'test.md'), 'utf-8');

// 规则
const rules = [
  {
    name: 'heading',
    reg: /^#{1,6} .+$/gm,
    replace: (content) => {
      const level = content.match(/^#+/)[0].length;
      const text = content.replace(/^#+/, '');
      return `<h${level}>${text}</h${level}>`;
    }
  },
  {
    name: 'list',
    reg: /^(\d+\.|-|\*) .+$/gm,
    replace: (content) => {
      const list = content.match(/(\d+\.|-|\*)/)[0];
      const text = content.replace(/(\d+\.|-|\*)/, '');
      if (list === '-') {
        return `<li>${text}</li>`;
      } else {
        return `<li>${text}</li>`;
      }
    }
  },
  {
    name: 'code',
    reg: /^```[\s\S]+?```$/gm,
    replace: (content) => {
      const code = content.replace(/^```/, '').replace(/```$/, '');
      return `<pre><code>${code}</code></pre>`;
    }
  },
  {
    name: 'blockquote',
    reg: /^> .+$/gm,
    replace: (content) => {
      const text = content.replace(/^> /, '');
      return `<blockquote>${text}</blockquote>`;
    }
  },
  {
    name: 'hr',
    reg: /^---$/gm,
    replace: () => {
      return `<hr/>`;
    }
  },
  {
    name: 'strong',
    reg: /\*\*[\s\S]+?\*\*/gm,
    replace: (content) => {
      const text = content.replace(/\*\*/, '');
      return `<strong>${text}</strong>`;
    }
  },
  {
    name: 'em',
    reg: /_([\s\S]+?)_/gm,
    replace: (content) => {
      const text = content.replace(/_/, '');
      return `<em>${text}</em>`;
    }
  },
  {
    name: 'a',
    reg: /\[([\s\S]+?)\]\(([\s\S]+?)\)/gm,
    replace: (content) => {
      const text = content.match(/\[([\s\S]+?)\]/)[1];
      const href = content.match(/\(([\s\S]+?)\)/)[1];
      return `<a href="${href}">${text}</a>`;
    }
  },
  {
    name: 'img',
    reg: /!\[([\s\S]+?)\]\(([\s\S]+?)\)/gm,
    replace: (content) => {
      const text = content.match(/\[([\s\S]+?)\]/)[1];
      const src = content.match(/\(([\s\S]+?)\)/)[1];
      return `<img src="${src}" alt="${text}"/>`;
    }
  },
  {
    name: 'p',
    reg: /^[\s\S]+$/gm,
    replace: (content) => {
      return `<p>${content}</p>`;
    }
  },
  {
    name: 'del',
    reg: /~~([\s\S]+?)~~/gm,
    replace: (content) => {
      const text = content.replace(/~~/, '');
      return `<del>${text}</del>`;
    }
  }
];

// 词法解析和语法解析
function lexer(md) {
  const tokens = [];
  let lastIndex = 0;
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    const reg = rule.reg;
    let match;
    while (match = reg.exec(md)) {
      const index = match.index;
      if (index > lastIndex) {
        tokens.push({
          type: 'text',
          content: md.slice(lastIndex, index)
        });
      }
      tokens.push({
        type: rule.name,
        content: match[0]
      });
      lastIndex = index + match[0].length;
    }
  }
  if (lastIndex < md.length) {
    tokens.push({
      type: 'text',
      content: md.slice(lastIndex)
    });
  }
  console.log(tokens);

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
  console.log(tokens);
  const html = parser(tokens);
  return html;
}

fs.writeFileSync(path.resolve(__dirname, 'test.html'), compiler(md));
