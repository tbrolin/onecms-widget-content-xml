var path    = require ('path'),
    // There may be a better module alternative to 'file'
    // walk = require ('walk');
    // However this module nicely fits the current use case
    walk = require ('walk');

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

  var inRoot = !path.relative (rootDir, currDir);
  var fPath = path.normalize(path.relative(rootDir, currDir));
  fPath = path.format ({ dir: fPath, base: file });
  console.log('[ D ] ', path.format ({ dir: fPath, base: file }));
  console.log('[DEBUG] fPath: ', fPath);
  console.log('[DEBUG] inRoot: ', inRoot);

  var files = json.aspects['atex.Files'].data.files;
  // console.log('DEBUG: [addFileElement] inRoot: ' + inRoot);
  if (inRoot) {
    fPath = fPath.replace('./', '');
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

module.exports = function (result, options) {
  result = {
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

  var walker = walk.walk (options.rootDir);
  walker.on ('file', function (root, fileStats, next) {
    // console.log('[DEBUG on->file] root: ', root);
    // console.log('[DEBUG on->file] file name: ', fileStats.name);
    addFile(result, options.rootDir, root, options.name, fileStats.name);
    next();
  });

  walker.on ('end', function () {
    console.log(JSON.stringify(result, null, '  '));
  });
};
