// markdomn-compile


const fs = require('fs');
const path = require('path');
const md = fs.readFileSync(path.resolve(__dirname, 'test.md'), 'utf-8');

// 规则
const rules = [
  {
    name: 'Heading',
    reg: /^#{1,6}\s+(.*)$/,
    replace: (match, p1) => {
      const level = match.match(/^#{1,6}/)[0].length;
      return `<h${level}>${p1}</h${level}>`;
    },
  },
];


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

console.log(compiler(md));
