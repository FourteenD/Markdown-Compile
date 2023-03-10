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
    }
  }
]
