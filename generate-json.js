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

function addFile (json, rootDir, currDir, widgetName, file) {
  if (endsWith (file, widgetName + '.json')) {
    return;
  }
  var fUri = path.relative (rootDir, file);
  var fName = fUri.replace ('.file', '');
  var inRoot = !path.relative (rootDir, currDir);
  var files = json.aspects['atex.Files'].data.files;

  if (inRoot) {
    fName = fName.replace(new RegExp(widgetName + '-'), '');
  }

  files[fName] = createEntry(fUri, fName);
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
