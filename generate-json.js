var path    = require ('path'),
    // There may be a better module alternative to 'file'
    // walk = require ('walk');
    // However this module nicely fits the current use case
    fsWalk = require ('file'),
    argv = require('minimist')(process.argv.slice(2)),
    options = {
      'widgetName':  argv.name || 'UNKNOWN',
      'root': argv.rootDir || argv.d || '.',
      get alias () {
        return 'externalid/atex.onecms.Widget-' + this.widgetName;
      },
      get verboseWidgetName () {
        return 'OneCMS Widget - ' + this.widgetName;
      }
    };

function endsWith (subject, suffix) {
  return (subject.indexOf(suffix, subject.length - suffix.length) !== -1);
}

function addFile (json, rootDir, currDir, widgetName, file) {

  if (endsWith (file, widgetName + '.json')) {
    return;
  } else if (endsWith (file, '.json')) {
    process.stderr.write ('[WARNING] The file ' + file + ' should probably be renamed to ' + file + '.file' + ' before import.\n');
  }

  var fUri = path.relative (rootDir, file);
  var fName = fUri.replace ('.file', '');
  var inRoot = !path.relative (rootDir, currDir);
  var files = json.aspects['atex.Files'].data.files;

  if (inRoot) {
    fName = fName.replace(new RegExp(widgetName + '-'), '');
  }

  files[fName] = {
    'fileUri': 'file:' + fUri,
    'filePath': fName
  };
}

function main (options) {
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
          'name': options.verboseWidgetName
        }
      }
    }
  };

  fsWalk.walk (options.root, function (err, currDir, dirs, files) {
    if (err) {
      process.stderr.write('ERROR:' + err.message + '\n');
      return;
    }
    files.forEach(addFile.bind({}, jsonimport, options.root, currDir, options.widgetName));
  });

  process.on('exit', function () {
    console.log(JSON.stringify(jsonimport, null, ' '));
  });
}

main (options);




