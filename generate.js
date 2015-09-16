var builder = require ('xmlbuilder'),
    path    = require ('path'),
    // There may be a better module alternative to 'file'
    // walk = require ('walk');
    // However this module nicely fits the current use case
    fsWalk = require ('file'),
    argv = require('minimist')(process.argv.slice(2)),
    options = {};

argv.rootDir = argv.rootDir || argv.d || '.';
argv.name = argv.name || 'UNKNOWN';

options.extid = 'atex.onecms.Widget-' + argv.name;
options.securityParent = 'atex.onecms.OneCMSSettings';
options.inputTemplate = 'atex.onecms.Widget.it';
options.componentName = 'OneCMS Widget - ' + argv.name;

function endsWith (subject, suffix) {
  return (subject.indexOf(suffix, subject.length - suffix.length) !== -1);
}

function addFileElement (xml, rootDir, currDir, cntName, file) {

  var fPath = path.relative (rootDir, file);
  // console.log('DEBUG: [path.relative (rootDir, currDir)]', path.relative (rootDir, currDir));
  var inRoot = !path.relative (rootDir, currDir);
  // console.log('DEBUG: [addFileElement] inRoot: ' + inRoot);
  if (inRoot) {
    if (endsWith (fPath, cntName + '.xml')) {
      // skip
    } else
    if (endsWith (fPath, 'widget.js')) {
      xml.ele('file', { 'name': 'widget.js', 'encoding': 'relative' }, fPath);
    } else
    if (endsWith (fPath, 'manifest.json')) {
      xml.ele('file', { 'name': 'manifest.json', 'encoding': 'relative' }, fPath);
    } else
    if (endsWith (fPath, 'template.html')) {
      xml.ele ('file', { 'name': 'template.html', 'encoding': 'relative' }, fPath);
    } else
    if (endsWith (fPath, 'style.css')) {
      xml.ele ('file', { 'name': 'style.css', 'encoding': 'relative' }, fPath);
    }
  } else {
    xml.ele ('file', { 'name': fPath, 'encoding': 'relative' }, fPath);
  }

}

var root = builder.create ('batch');
root.att('xmlns', 'http://www.polopoly.com/polopoly/cm/xmlio');
var contentxml = root
  .ele ('content')
    .ele('metadata')
      .ele('contentid')
        .ele('major', 'AppConfig')
        .insertAfter('externalid', options.extid)
        .up()
      .up()
      .ele('security-parent')
        .ele('externalid', options.securityParent)
        .up()
      .up()
      .ele('input-template')
        .ele('externalid', options.inputTemplate)
        .up()
      .up()
    .up()
    .ele('component', {'group':'polopoly.Content', 'name': 'name'}, options.componentName)
    .up()

var result = fsWalk.walk (argv.rootDir, function (err, currDir, dirs, files) {
  if (err) {
    console.err('ERROR:', err);
    return;
  }
  // console.log('DEBUG: [walk.callback] currDir: ', currDir)
  files.forEach(addFileElement.bind({}, contentxml, argv.rootDir, currDir, argv.name));
});

process.on('exit', function () {
  console.log(root.end({ 'pretty': true }));
});
