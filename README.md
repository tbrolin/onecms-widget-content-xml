# onecms-widget-content-xml
Generates a content xml from a widget source directory.

```bash
git clone git@github.com:tbrolin/onecms-widget-content-xml.git
cd onecms-widget-content-xml
npm install
node generate.js --rootDir 'path/to/myWidget' --name myWidget > atex.onecms.Widget-myWidget.xml
