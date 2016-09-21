# onecms-widget-content-xml
Generates a content xml from a widget source directory.

```bash
$ git clone git@github.com:tbrolin/onecms-widget-content-xml.git
$ cd onecms-widget-content-xml
$ npm install
$ node generate.js --rootDir path/to/myWidget --name myWidget > atex.onecms.Widget-myWidget.xml
```

Currently the script relies heavily on the widget source directory structure. Especially any files in the rootDir that ends with manifest.json, style.css, template.html or widget.js are special. It doesn't read anything from the manifest.json at all.

## Generate json import

There is a script generate-json.js in the branch support-json-import that can be used to generate json import data.

```bash
$ git checkout support-json-import
$ node generate-json.js --rootDir path/to/myWidget --name myWidget > atex.onecms.Widget-myWidget.json
```

* Please use the [issue tracker](https://github.com/tbrolin/onecms-widget-content-xml/issues) to suggest features or report bugs.
* Please fork or branch me and create pull requests.
* Please **do not** push to master like some crazy infidel.
