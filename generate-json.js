var path    = require ('path'),
    // There may be a better module alternative to 'file'
    // walk = require ('walk');
    // However this module nicely fits the current use case
    fsWalk = require ('file'),
    argv = require('minimist')(process.argv.slice(2)),
    options = {};

argv.rootDir = argv.rootDir || argv.d || '.';
argv.name = argv.name || 'UNKNOWN';

options.alias = 'externalid/atex.onecms.Widget-' + argv.name;
// hrrm...
options.fileUriPrefix = 'file:' + argv.name + '-';
options.componentName = 'OneCMS Widget - ' + argv.name;

function endsWith (subject, suffix) {
  return (subject.indexOf(suffix, subject.length - suffix.length) !== -1);
}

function createEntry (uri, path) {
  return {
    'fileUri': 'file:' + uri,
    'filePath': path
  };
}

function addFile (json, rootDir, currDir, cntName, file) {

  var fPath = path.relative (rootDir, file);
  // console.log('DEBUG: [path.relative (rootDir, currDir)]', path.relative (rootDir, currDir));
  var inRoot = !path.relative (rootDir, currDir);

  var files = json.aspects['atex.Files'].data.files;
  // console.log('DEBUG: [addFileElement] inRoot: ' + inRoot);
  if (inRoot) {
    if (endsWith (fPath, cntName + '.json')) {
      // skip
    } else
    if (endsWith (fPath, 'widget.js')) {
      files['widget.js'] = createEntry(fPath, 'widget.js');
      // xml.ele('file', { 'name': 'widget.js', 'encoding': 'relative' }, fPath);
    } else
    if (endsWith (fPath, 'manifest.json.file')) {
      files['manifest.js'] = createEntry(fPath, 'manifest.json');
      // xml.ele('file', { 'name': 'manifest.json', 'encoding': 'relative' }, fPath);
    } else
    if (endsWith (fPath, 'template.html')) {
      files['template.html'] = createEntry(fPath, 'template.html');
      // xml.ele ('file', { 'name': 'template.html', 'encoding': 'relative' }, fPath);
    } else
    if (endsWith (fPath, 'style.css')) {
      files['style.css'] = createEntry(fPath, 'style.css');
      // xml.ele ('file', { 'name': 'style.css', 'encoding': 'relative' }, fPath);
    }
  } else {
    files[fPath] = createEntry(fPath, fPath);
    // xml.ele ('file', { 'name': fPath, 'encoding': 'relative' }, fPath);
  }

}

var jsonimport = {
  'importerMetadata': {
    alias: options.alias
  },
  'aspects': {
    'atex.Files': {
      'data': {
        '_type': 'atex.Files',
        'files': {}
      }
    },
    'contentData': {
      'data': {
        '_type': 'widget',
        'name': options.componentName
      }
    }
  }
};


var result = fsWalk.walk (argv.rootDir, function (err, currDir, dirs, files) {
  if (err) {
    console.err('ERROR:', err);
    return;
  }
  // console.log('DEBUG: [walk.callback] currDir: ', currDir)
  files.forEach(addFile.bind({}, jsonimport, argv.rootDir, currDir, argv.name));
});

process.on('exit', function () {
  console.log(JSON.stringify(jsonimport, null, ' '));
  // console.log(root.end({ 'pretty': true }));
});
