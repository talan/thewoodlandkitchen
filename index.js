const {h, create} = require('virtual-dom');
const {readFileSync} = require('fs');
const express = require('express');
const app = express();

const {tagMatch, sizes, images} = require('./config');

function src(size, props, describeWidth) {
  const width = describeWidth ? ` ${size}w` : '';
  return `${props.host}/${props.path}/${size}/${props.id}${props.type}${width}`;
}

function image(props) {
  const img = Object.assign({
    host: '',
    path: 'img'
  }, images.find((img) => img.id === parseInt(props)));
  return h('img', {
    src: src(sizes[0], img),
    title: img.title,
    alt: img.title,
    srcset: sizes.map((size) => src(size, img, true)).join(', ')
  });
}

function render(html) {
  while(tag = tagMatch.exec(html)) {
    const respimg = image(tag[1]);
    html = html.replace(tag[0], create(respimg));
  }
  return html;
}

app.use('/css', express.static('./css'));
app.use('/img', express.static('./img'));
app.use(function (request, response) {
  response.send(render(readFileSync('./index.html').toString()));
});
app.listen(8080, '0.0.0.0');
