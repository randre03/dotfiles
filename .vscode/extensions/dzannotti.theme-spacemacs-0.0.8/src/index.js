var yaml = require('yamljs')
var plist = require('simple-plist')
var fs = require('fs')

var colors = {
  act1: '#222226',
  act2: '#5d4d7a',
  base: '#b2b2b2',
  'base-dim': '#545557',
  bg1: '#292b2e',
  bg2: '#212026',
  bg3: '#100a14',
  bg4: '#0a0814',
  border: '#5d4d7a',
  cblk: '#cbc1d5',
  'cblk-bg': '#2f2b33',
  'cblk-ln': '#827591',
  'cblk-ln-bg': '#373040',
  cursor: '#e3dedd',
  const: '#a45bad',
  comment: '#2aa1ae',
  'comment-bg': '#292e34',
  comp: '#c56ec3',
  err: '#e0211d',
  func: '#bc6ec5',
  head1: '#4f97d7',
  'head1-bg': '#293239',
  head2: '#2d9574',
  'head2-bg': '#293235',
  head3: '#67b11d',
  'head3-bg': '#293235',
  head4: '#b1951d',
  'head4-bg': '#32322c',
  highlight: '#444155',
  keyword: '#4f97d7',
  lnum: '#44505c',
  mat: '#86dc2f',
  meta: '#9f8766',
  str: '#2d9574',
  suc: '#86dc2f',
  ttip: '#9a9aba',
  'ttip-sl': '#5e5079',
  'ttip-bg': '#34323e',
  type: '#ce537a',
  var: '#7590db',
  war: '#dc752f '
}

function colorize(obj) {
  for (var key in obj) {
    if (typeof obj[key] === 'string') {
      var value = obj[key]
      if (colors[value]) {
        obj[key] = colors[value]
      }
    } else if (Array.isArray(obj[key])) {
      obj[key].forEach(function (_, idx) {
        obj[key][idx] = colorize(obj[key][idx])
      })
    } else if (typeof obj[key] === 'object') {
      obj[key] = colorize(obj[key])
    }
  }
  return obj
}

var inputTheme = yaml.load('./theme.yml')
var completeTheme = {
  name: 'Spacemacs',
  settings: colorize(inputTheme)
}

var xml = plist.stringify(completeTheme)
fs.writeFileSync('../themes/Spacemacs.tmTheme', xml, 'utf-8')
