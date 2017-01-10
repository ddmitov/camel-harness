camel-harness
--------------------------------------------------------------------------------

[![GitHub Version](https://img.shields.io/github/release/ddmitov/camel-harness.svg)](https://github.com/ddmitov/camel-harness/releases)
[![GitHub License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE.md)
[![NPM Version](https://img.shields.io/npm/v/camel-harness.svg)](https://www.npmjs.com/package/camel-harness)
[![Travis CI Build Status](https://travis-ci.org/ddmitov/camel-harness.svg?branch=master)](https://travis-ci.org/ddmitov/camel-harness)
[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/ddmitov/camel-harness?branch=master&svg=true)](https://ci.appveyor.com/project/ddmitov/camel-harness)
[![Coverity Scan Build Status](https://scan.coverity.com/projects/11336/badge.svg)](https://scan.coverity.com/projects/ddmitov-camel-harness)
[![Known Vulnerabilities](https://snyk.io/test/github/ddmitov/camel-harness/badge.svg)](https://snyk.io/test/github/ddmitov/camel-harness)  

camel-harness is a small [Node.js](http://nodejs.org/) - [Electron](http://electron.atom.io/) - [NW.js](http://nwjs.io/) library for asynchronous handling of [Perl 5](https://www.perl.org/) scripts.

## Quick Start
``npm install camel-harness``  

```javascript
const camelHarness = require('camel-harness');

var perlScriptObject = new Object();
perlScriptObject.interpreter = 'perl';
perlScriptObject.scriptFullPath = '/test/test.pl';

perlScriptObject.stdoutFunction = function(stdout) {
  console.log(stdout);
};

camelHarness.startScript(perlScriptObject);
```

## Core Dependencies
* ``child_process``
* ``fs``

## External Dependency
The only external dependency of camel-harness is a Perl interpreter on PATH or any other Perl interpreter identified by its full pathname. camel-harness npm package test will fail if no ``perl`` binary is available on PATH.

## API

```javascript
const camelHarness = require('camel-harness');

var perlScriptObject = new Object();
 // mandatory object property
perlScriptObject.interpreter = 'perl';
 // mandatory object property
perlScriptObject.scriptFullPath = '/test/test.pl';

// mandatory object property:
perlScriptObject.stdoutFunction = function(stdout) {
  document.getElementById('DOM-element-id').innerHTML = stdout;
};

perlScriptObject.stderrFunction = function(stderr) {
  console.log('Perl script STDERR:\n' + stderr);
}

perlScriptObject.exitFunction = function(exitCode) {
  console.log('Perl script exited with exit code ' + exitCode);
}

perlScriptObject.interpreterSwitches = '-M-ops=fork';

perlScriptObject.method = 'POST';

var formData = $('#form-id').serialize();
perlScriptObject.formData = formData;

camelHarness.startScript(perlScriptObject);
```

  * **perlInterpreter:**  
  This is the full pathname of a Perl interpreter or just the filename of a Perl interpreter on PATH.  
  This object property is mandatory.  

* **scriptFullPath:**  
  This is the full path of the Perl script that is going to be executed.  
  This object property is mandatory.  

* **stdoutFunction:**  
  This is the name of the function that will be executed every time when output is available on STDOUT.  
  The only parameter passed to the ``stdoutFunction`` function is the ``stdout`` string.  
  This object property is mandatory.  

* **stderrFunction:**  
  This is the name of the function that will be executed every time when output is available on STDERR.  
  The only parameter passed to this function is the ``stderr`` string.  

* **exitFunction:**  
  This is the name of the function that will be executed when a Perl script is finished.  
  The only parameter passed to this function is the ``exitCode`` string.  

* **interpreterSwitches:**  
  They are supplied to the Perl interpreter on runtime.  
  The ``-M-ops=fork`` switch disables the Perl ``fork`` core function and it could be used to minimize the chances of leaving orphaned Perl processes after a [Node.js](http://nodejs.org/) - [Electron](http://electron.atom.io/) - [NW.js](http://nwjs.io/) process is terminated.  

* **method:**  
  Only ``GET`` or ``POST`` are allowed.  
  This object property has no effect if ``formData`` is not set.  

* **formData:**  
  This object property has no effect if ``method`` is not set.  
  camel-harness does not depend on [jQuery](https://jquery.com/), but it can be used for easy acquisition of form data:  

  ```javascript
  var formData = $('#form-id').serialize();
  ```

## Interactive Scripts
camel-harness can also start and communicate with interactive scripts having their own event loops and capable of repeatedly receiving STDIN input. Use the following code to send data to the standard input of an interactive script waiting for data on STDIN:

```javascript
var data = document.getElementById('interactive-script-input').value;
perlScriptObject.scriptHandler.stdin.write(data + '\n');
```

This package includes a demo application for [Electron](http://electron.atom.io/) and [NW.js](http://nwjs.io/) featuring a Perl script that can be constantly fed with data from an HTML interface. Perl with the ``AnyEvent`` Perl module has to be available on PATH.  

## Perl Interpreter
Any Perl interpreter is usable for camel-harness - either a Perl interpreter on PATH or a Perl interpreter identified by its full pathname. [Strawberry Perl](http://strawberryperl.com/) PortableZIP edition distributed together with an [Electron](http://electron.atom.io/) or [NW.js](http://nwjs.io/) binary could also be used on a Windows machine.  

## Electron Demo
* Download and extract the [camel-harness package](https://github.com/ddmitov/camel-harness).  
* Download the [Electron binary package for your operating system](https://github.com/electron/electron/releases) and extract it inside the previously extracted ``camel-harness-master/demo`` folder. Confirm merging of the ``resources`` subfolder of Electron with the ``resources`` subfolder of the demo.  
* Start the Electron binary.  

## NW.js Demo
* Download and extract the [camel-harness package](https://github.com/ddmitov/camel-harness).  
* Download and extract the [NW.js binary package for your operating system](http://nwjs.io/downloads/). It will create its own folder.  
* Copy everything inside the ``camel-harness-master/demo`` folder in the folder of the NW.js binary.  
* Start the NW.js binary.  

## [Thanks and Credits](./CREDITS.md)

## License
MIT © 2016 - 2017 Dimitar D. Mitov  
