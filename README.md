camel-harness
--------------------------------------------------------------------------------
[![GitHub Version](https://img.shields.io/github/release/ddmitov/camel-harness.svg)](https://github.com/ddmitov/camel-harness/releases)
[![GitHub License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE.md) [![NPM Version](https://img.shields.io/npm/v/camel-harness.svg)](https://www.npmjs.com/package/camel-harness)  
```camel-harness``` is a small [Node.js](http://nodejs.org/) - [Electron](http://electron.atom.io/) - [NW.js](http://nwjs.io/) library for handling of asynchronous [Perl 5](https://www.perl.org/) scripts.

## Node.js Quick Start
Type one of the following two install commands:  

```npm install camel-harness```  
```npm install git+https://github.com/ddmitov/camel-harness.git```  

Use ```camel-harness``` from your code:

```javascript
var harness = require('camel-harness');

harness.camelHarness(perlInterpreter, scriptFullPath, stdoutFunction,
  stderrFunction, errorFunction, exitFunction, method, formData);
```

## Electron Demo
* Download the [camel-harness package](https://github.com/ddmitov/camel-harness).  
* Download the [Electron binary package for your operating system](https://github.com/electron/electron/releases).  
* Extract the downloaded ```camel-harness``` package.  
* Extract the downloaded [Electron](http://electron.atom.io/) binary package inside the previously extracted ```camel-harness-master/electron-nwjs-demo``` folder. Confirm the merging of the ```resources``` subfolder of [Electron](http://electron.atom.io/) with the ```resources``` subfolder of the demo.  
* Start the [Electron](http://electron.atom.io/) binary.  

## NW.js Demo
* Download the [camel-harness package](https://github.com/ddmitov/camel-harness).  
* Download the [NW.js binary package for your operating system](http://nwjs.io/downloads/).  
* Extract the downloaded [NW.js](http://nwjs.io/) binary package. It will create its own folder.  
* Extract the downloaded ```camel-harness``` package and copy everything inside its ```camel-harness-master/electron-nwjs-demo``` subfolder in the folder of the [NW.js](http://nwjs.io/) binary.  
* Start the [NW.js](http://nwjs.io/) binary.  

## Node.js - Electron - NW.js Core Module Dependencies
* ```child_process```
* ```fs```

## External Dependency
The only external dependency of ```camel-harness``` is a Perl interpreter on PATH or any other Perl interpreter identified by its full pathname. ```camel-harness``` package test will fail if no Perl interpreter is available on PATH.

## API

```javascript
var harness = require('camel-harness');

harness.camelHarness(perlInterpreter, scriptFullPath, stdoutFunction,
  stderrFunction, errorFunction, exitFunction, method, formData);
```

  * **perlInterpreter:**  
  This is the full pathname of a Perl interpreter or just the filename of a Perl interpreter on PATH.  
  This parameter is mandatory.  

* **scriptFullPath:**  
  This is the full path of the Perl script that is going to be executed. This parameter is mandatory.  

* **stdoutFunction:**  
  This is the name of the function that will be executed every time when output is available on STDOUT.  
  This parameter is mandatory.  
  The only argument passed to the ```stdoutFunction``` function is the ```stdout``` string. Example:  

```javascript
  function camelHarnessStdout(stdout) {
    document.getElementById("DOM-element-id").innerHTML = stdout;
  }
```

* **stderrFunction:**  
  This is the name of the function that will be executed every time when output is available on STDERR.  
  The only argument passed to this function is the ```stderr``` string. Example:  

```javascript
  function camelHarnessStderr(stderr) {
    console.log('Perl script STDERR:\n' + stderr);
  }
```

* **errorFunction:**  
  This is the name of the function that will be executed to read errors from a Perl script.  
  The only argument passed to this function is the ```error``` object. Example:  

```javascript
  function camelHarnessError(error) {
    console.log(error.stack);
    console.log('Perl script error code: ' + error.code);
    console.log('Perl script signal received: ' + error.signal);
  }
```

* **exitFunction:**  
  This is the name of the function that will be executed when a Perl script is finished.  
  The only argument passed to this function is the ```exitCode``` string. Example:  

```javascript
  function camelHarnessExit(exitCode) {
    console.log('Perl script exited with exit code ' + exitCode);
  }
```

* **method:**  
  ```GET``` or ```POST```

* **formData:**  
  ```formData``` is mandatory parameter if ```method``` is set.  
  ```camel-harness``` does not depend on [jQuery](https://jquery.com/), but it can be used for easy acquisition of form data:  

```javascript
  var formData = $("#form-id").serialize();
```

## Perl Interpreter
```camel-harness``` is able to use any Perl interpreter - either a Perl interpreter on PATH or a Perl interpreter identified by its full pathname. [Strawberry Perl](http://strawberryperl.com/) PortableZIP edition distributed together with [Electron](http://electron.atom.io/) or [NW.js](http://nwjs.io/) binaries could also be used on a Windows machine.  

## Security
```camel-harness``` executes all Perl scripts with the ```fork``` core function banned using the command line switch ```-M-ops=fork```. ```fork``` is banned to avoid orphan processes, which may be created if this function is carelessly used.  

## [Thanks and Credits](./CREDITS.md)

## License
MIT © 2016 Dimitar D. Mitov  
