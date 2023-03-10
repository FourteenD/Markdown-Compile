// markdomn-compile


const fs = require('fs');
const path = require('path');
const md = fs.readFileSync(path.resolve(__dirname, 'test.md'), 'utf-8');

// 规则
const rules = [
  {
    name: 'Heading',
    reg: /^#{1,6}\s+(.*)$/,
    replace: (match, p1) => `<h${match.split(' ')[0].length}>${p1}</h${match.split(' ')[0].length}>`,
  },
];
