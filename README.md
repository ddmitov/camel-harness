camel-harness
--------------------------------------------------------------------------------
[![GitHub Version](https://img.shields.io/github/release/ddmitov/camel-harness.svg)](https://github.com/ddmitov/camel-harness/releases)
[![GitHub License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE.md) [![NPM Version](https://img.shields.io/npm/v/camel-harness.svg)](https://www.npmjs.com/package/camel-harness)
[![Build Status](https://travis-ci.org/ddmitov/camel-harness.svg?branch=master)](https://travis-ci.org/ddmitov/camel-harness)
[![Build Status](https://ci.appveyor.com/api/projects/status/github/ddmitov/camel-harness?branch=master&svg=true)](https://ci.appveyor.com/project/ddmitov/camel-harness)  
```camel-harness``` is a small [Node.js](http://nodejs.org/) - [Electron](http://electron.atom.io/) - [NW.js](http://nwjs.io/) library for asynchronous handling of [Perl 5](https://www.perl.org/) scripts.

## Quick Start
* Install using one of the following commands:  

```npm install camel-harness```  
```npm install git+https://github.com/ddmitov/camel-harness.git```  

* Use from code:

```javascript
var camelHarness = require('camel-harness');

var perlScript = new Object();
perlScript.interpreter = "perl";
perlScript.scriptFullPath = "/test/test.pl";

perlScript.stdoutFunction = function(stdout) {
  console.log(stdout);
};

camelHarness.startScript(perlScript);
```

## Electron Demo
* Download the [camel-harness package](https://github.com/ddmitov/camel-harness).  
* Download the [Electron binary package for your operating system](https://github.com/electron/electron/releases).  
* Extract the downloaded ```camel-harness``` package.  
* Extract the downloaded [Electron](http://electron.atom.io/) binary package inside the previously extracted ```camel-harness-master/electron-nwjs-demo``` folder. Confirm merging of the ```resources``` subfolder of [Electron](http://electron.atom.io/) with the ```resources``` subfolder of the demo.  
* Start the [Electron](http://electron.atom.io/) binary.  

## NW.js Demo
* Download the [camel-harness package](https://github.com/ddmitov/camel-harness).  
* Download the [NW.js binary package for your operating system](http://nwjs.io/downloads/).  
* Extract the downloaded [NW.js](http://nwjs.io/) binary package. It will create its own folder.  
* Extract the downloaded ```camel-harness``` package and copy everything inside its ```camel-harness-master/electron-nwjs-demo``` subfolder in the folder of the [NW.js](http://nwjs.io/) binary.  
* Start the [NW.js](http://nwjs.io/) binary.  

## Core Dependencies
* ```child_process```
* ```fs```

## External Dependency
The only external dependency of ```camel-harness``` is a Perl interpreter on PATH or any other Perl interpreter identified by its full pathname. ```camel-harness``` package test will fail if no Perl interpreter is available on PATH.

## API

```javascript
var camelHarness = require('camel-harness');

var perlScript = new Object();
perlScript.interpreter = "perl"; // mandatory object property
perlScript.scriptFullPath = "/test/test.pl"; // mandatory object property

// mandatory object property:
perlScript.stdoutFunction = function(stdout) {
  document.getElementById("DOM-element-id").innerHTML = stdout;
};

perlScript.stderrFunction = function(stderr) {
  console.log('Perl script STDERR:\n' + stderr);
}

perlScript.exitFunction = function(exitCode) {
  console.log('Perl script exited with exit code ' + exitCode);
}

perlScript.method = "POST";

var formData = $("#form-id").serialize();
perlScript.formData = formData;

camelHarness.startScript(perlScript);
```

  * **perlInterpreter:**  
  This is the full pathname of a Perl interpreter or just the filename of a Perl interpreter on PATH.  
  This object property is mandatory.  

* **scriptFullPath:**  
  This is the full path of the Perl script that is going to be executed.  
  This object property is mandatory.  

* **stdoutFunction:**  
  This is the name of the function that will be executed every time when output is available on STDOUT.  
  The only parameter passed to the ```stdoutFunction``` function is the ```stdout``` string.  
  This object property is mandatory.  

* **stderrFunction:**  
  This is the name of the function that will be executed every time when output is available on STDERR.  
  The only parameter passed to this function is the ```stderr``` string.  

* **exitFunction:**  
  This is the name of the function that will be executed when a Perl script is finished.  
  The only parameter passed to this function is the ```exitCode``` string.  

* **method:**  
  ```GET``` or ```POST```  
  ```method``` is mandatory object property if ```formData``` is set.  

* **formData:**  
  ```formData``` is mandatory object property if ```method``` is set.  
  ```camel-harness``` does not depend on [jQuery](https://jquery.com/), but it can be used for easy acquisition of form data:  

```javascript
  var formData = $("#form-id").serialize();
```

## Perl Interpreter
```camel-harness``` is able to use any Perl interpreter - either a Perl interpreter on PATH or a Perl interpreter identified by its full pathname. [Strawberry Perl](http://strawberryperl.com/) PortableZIP edition distributed together with an [Electron](http://electron.atom.io/) or [NW.js](http://nwjs.io/) binary could also be used on a Windows machine.  

## Security
```camel-harness``` executes Perl scripts with the command line switch ```-M-ops=fork``` banning the ```fork``` core function. ```fork``` is banned to avoid orphan processes, which may be created if this function is carelessly used.  

## [Thanks and Credits](./CREDITS.md)

## License
MIT © 2016 Dimitar D. Mitov  
