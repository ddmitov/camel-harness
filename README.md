CamelHarness.js
--------------------------------------------------------------------------------
[![GitHub Version](https://img.shields.io/github/release/ddmitov/camel-harness.svg)](https://github.com/ddmitov/camel-harness/releases)
[![GitHub License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE.md)  
```CamelHarness.js``` is a small Node.js library that can start asynchronously and with no timeout [Perl 5] (https://www.perl.org/) scripts from [Node.js] (http://nodejs.org/), [Electron] (http://electron.atom.io/) or [NW.js] (http://nwjs.io/) applications.

## Quick Start
**To use with ```Node.js```:**  
```npm install git+https://github.com/ddmitov/camel-harness.git```  

**To use with ```Electron```:**
  1. Download the ```CamelHarness.js``` package from GitHub.  
  2. Download the ```Electron``` binary package for your operating system from [https://github.com/electron/electron/releases] (https://github.com/electron/electron/releases).  
  3. Extract the downloaded ```CamelHarness.js``` package.  
  4. Extract the downloaded ```Electron``` binary package inside the previously extracted ```camel-harness-master/tests/electron-nwjs``` folder. Confirm the merging of the ```resources``` subfolder of ```Electron``` with the ```resources``` subfolder of the ```CamelHarness.js``` example.  
  5. start the ```Electron``` binary inside the ```camel-harness``` folder.  

**To use with ```NW.js```:**
  1. Download the ```CamelHarness.js``` package from GitHub.  
  2. Download the ```NW.js``` binary package for your operating system from [http://nwjs.io/downloads/] (http://nwjs.io/downloads/).  
  3. Extract the downloaded ```NW.js``` binary package. It will create its own folder.  
  4. Extract the downloaded ```CamelHarness.js``` source package and copy everything inside its ```camel-harness-master/tests/electron-nwjs``` subfolder in the folder of the ```NW.js``` binary.  
  5. start the ```NW.js``` binary inside the ```camel-harness``` folder.  

## Dependencies
* ```child_process``` Node.js module - available in both [Electron] (http://electron.atom.io/) and [NW.js] (http://nwjs.io/)
* Perl interpreter on PATH or any other Perl interpreter identified by its full pathname

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
  Form data can be easily acquired using ```jQuery``` like that:  

```javascript
  var formData = $("#form-id").serialize();
```

  Note that ```CamelHarness.js``` itself does not depend on ```jQuery```.  
  ```formData``` is mandatory parameter if ```method``` is set.  

## Perl Interpreter
```CamelHarness.js``` is able to use any Perl interpreter - either a Perl interpreter on PATH or a Perl interpreter identified by its full pathname. [Strawberry Perl] (http://strawberryperl.com/) PortableZIP edition distributed together with ```Electron``` or ```NW.js``` could also be used on a Windows machine.  

## Security
```CamelHarness.js``` executes all Perl scripts with the ```fork``` core function banned using the command line switch ```-M-ops=fork```. ```fork``` is banned to avoid orphan processes, which may be created if this function is carelessly used.  

## [Thanks and Credits] (./CREDITS.md)

## License

  MIT © 2016 Dimitar D. Mitov  
