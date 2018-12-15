# camel-harness

[![Travis CI Build Status](https://travis-ci.org/ddmitov/camel-harness.svg?branch=master)](https://travis-ci.org/ddmitov/camel-harness)
[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/ddmitov/camel-harness?branch=master&svg=true)](https://ci.appveyor.com/project/ddmitov/camel-harness)
[![Inline docs](http://inch-ci.org/github/ddmitov/camel-harness.svg?branch=master)](http://inch-ci.org/github/ddmitov/camel-harness)  
[![Coverity Scan Build Status](https://scan.coverity.com/projects/11336/badge.svg)](https://scan.coverity.com/projects/ddmitov-camel-harness)
[![Snyk Status](https://snyk.io/test/github/ddmitov/camel-harness/badge.svg)](https://snyk.io/test/github/ddmitov/camel-harness)  
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/4b8a244d415b4bafbdf9e50148bf7372)](https://www.codacy.com/app/ddmitov/camel-harness?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ddmitov/camel-harness&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/b9431bac8e7b41daab6f/maintainability)](https://codeclimate.com/github/ddmitov/camel-harness/maintainability)

[Node.js](http://nodejs.org/) - [Electron](http://electron.atom.io/) - [NW.js](http://nwjs.io/) package for asynchronous handling of [Perl](https://www.perl.org/) scripts

## Quick Start

``npm install camel-harness``  

```javascript
const camelHarness = require("camel-harness");

let perlTest = {};
perlTest.script = "/test/test.pl";

perlTest.stdoutFunction = function (stdout) {
  console.log(stdout);
};

camelHarness.startScript(perlTest);
```

## Core Dependency

``child_process``

## External Dependency

Perl interpreter identified by filename on PATH or full pathname  

camel-harness npm package test will fail if no ``perl`` binary is available on PATH.  

## API

All settings of a Perl script executed by camel-harness are stored in a JavaScript object with an arbitrary name and the following object properties:  

* **script**  
  ``String`` for Perl script full path or Perl code executed as an one-liner  
  *This object property is mandatory.*  

  ```javascript
  perlTest.script = "/full/path/to/test.pl";
  ```

  The ``-e`` interpreter switch must be set when Perl code is executed in one-liner mode.  
  Perl code must not be surrounded in single quotes and all double quotes must be escaped.  

  One-liner example:  

  ```javascript
  let oneLiner = {};

  oneLiner.interpreterSwitches = [];
  oneLiner.interpreterSwitches.push("-e");

  oneLiner.script = "use English; print \"Perl $PERL_VERSION\";"

  oneLiner.stdoutFunction = function (stdout) {
    console.log(`${stdout}`);
  };

  camelHarness.startScript(oneLiner);
  ```

* **stdoutFunction**  
  will be executed every time data is available on STDOUT  
  The only parameter passed to the ``stdoutFunction`` is the STDOUT ``String``.  

  ```javascript
  perlTest.stdoutFunction = function (stdout) {
    document.getElementById("DOM-element-id").textContent = stdout;
  };
  ```

* **stderrFunction**  
  will be executed every time data is available on STDERR  
  The only parameter passed to the ``stderrFunction`` is the STDERR ``String``.  

  ```javascript
  perlTest.stderrFunction = function (stderr) {
    console.log("Perl script STDERR:\n");
    console.log(stderr);
  };
  ```

* **errorFunction**  
  will be executed on Perl script error  
  The only parameter passed to the ``errorFunction`` is the error ``Object``.  

  The ``errorFunction`` can generate a message when Perl interpreter is not found:  

  ```javascript
  perlTest.errorFunction = function (error) {
    if (error.code === "ENOENT") {
      console.log("Perl interpreter was not found.");
    }
  };
  ```

* **exitFunction**  
  will be executed when Perl script has ended  
  The only parameter passed to the ``exitFunction`` is the exit code ``String``.  

  The ``exitFunction`` can generate a message when Perl script is not found:  

  ```javascript
  perlTest.exitFunction = function (exitCode) {
    if (exitCode === 2) {
      console.log("Perl script was not found.");
    }
  };
  ```

* **perlInterpreter**  
  ``String`` for a Perl interpreter: either filename on PATH or full pathname  
  If no ``perlInterpreter`` is defined, ``perl`` binary on PATH is used, if available.  

  ```javascript
  perlTest.interpreter = "/full/path/to/perl";
  ```

* **interpreterSwitches**  
  ``Array`` for Perl interpreter switches  

  ```javascript
  perlTest.interpreterSwitches = [];
  perlTest.interpreterSwitches.push("-W");
  ```

* **scriptArguments**  
  ``Array`` for Perl script arguments  

  ```javascript
  perlTest.scriptArguments = [];
  perlTest.scriptArguments.push("argument-one");
  perlTest.scriptArguments.push("argument-two");
  ```

* **options**  
  ``Object`` for Perl script options passed to the ``child_process`` core module.  
  Click [here](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) for a full list of all available ``child_process`` options.

* **options.cwd**  
  ``String`` for a new Perl script current working directory  

  ```javascript
  perlTest.options = {};
  perlTest.options.cwd = "/full/path/to/current-working-directory";;
  ```

* **options.env**  
  ``Object`` for a new Perl script environment  

  Script environment with an inherited PATH and a new variable:  

  ```javascript
  perlTest.options = {};
  perlTest.options.env = {};
  perlTest.options.env.PATH = process.env.PATH;
  perlTest.options.env.TEST = "test";
  ```

* **options.detached**  
  ``Boolean`` option for starting detached Perl processes like servers  

  ``options.detached`` must be set to ``true`` and  
  ``options.stdio`` must be set to ``"ignore"`` to  
  start a detached process without receiving anything from it.  
  A process detached with the above options can run even after its parent has ended.  

  Example settings for a Perl server application:  

  ```javascript
  let perlServer = {};
  perlServer.script = "/path/to/perl-server-application";

  perlServer.options = {};
  perlServer.options.detached = true;
  perlServer.options.stdio = "ignore";

  const camelHarness = require("camel-harness");
  camelHarness.startScript(perlServer);

  perlServer.scriptHandler.unref();
  ```

* **inputData**  
  ``String`` or ``Function`` supplying user data as its return value.  
  ``inputData`` is written on script STDIN.  

  ``inputData`` function with no dependencies:  

  ```javascript
  perlTest.inputData = function () {
    let data = document.getElementById("input-box-id").value;
    return data;
  }
  ```

## Interactive Scripts

camel-harness can also start and communicate with interactive scripts having their own event loops and capable of repeatedly receiving STDIN input. Use the following code to send data to an interactive script waiting for input on STDIN:

```javascript
let data = document.getElementById("interactive-script-input").value;
perlTest.scriptHandler.stdin.write(data);
```

camel-harness demo packages for [Electron](https://www.npmjs.com/package/camel-harness-demo-electron) and [NW.js](https://www.npmjs.com/package/camel-harness-demo-nwjs) include a Perl script that can be constantly fed with data from an HTML interface. Perl with the ``AnyEvent`` CPAN module has to be available on PATH.  

## [Electron Demo](https://www.npmjs.com/package/camel-harness-demo-electron)

## [NW.js Demo](https://www.npmjs.com/package/camel-harness-demo-nwjs)

## [Credits](./CREDITS.md)

## [License](./LICENSE.md)

MIT 2016 - 2018  
Dimitar D. Mitov  
