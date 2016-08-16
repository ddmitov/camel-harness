
CamelHarness.js
==================================
  
CamelHarness.js is a small JavaScript library that can start [Perl 5] (https://www.perl.org/) scripts from an application based on [Electron] (http://electron.atom.io/) or [NW.js] (http://nwjs.io/).
  
## Node.js Module Dependencies
All dependencies of CamelHarness.js are available inside [Electron] (http://electron.atom.io/) and [NW.js] (http://nwjs.io/).
* ```child_process```
* ```fs```
* ```os```
* ```path```
  
## API
  Example: ```camelHarness(scriptFullPath, stdoutFunction, stderrFunction, errorFunction, exitFunction, method, formData);```  
* **scriptFullPath:**  
  This is the full path of the Perl script that is going to be executed. This parameter is mandatory.  
  
* **stdoutFunction:**  
  This is the name of the function that will be executed every time there is output on STDOUT.  
  This parameter is mandatory.  
  The only argument passed to this function is the ```stdout``` string. Example:  

```javascript
  function camelHarnessStdout(stdout) {
      document.getElementById("DOM-element-id").innerHTML = stdout;
  }
```

* **stderrFunction:**  
  This is the name of the function that will be executed every time there is output on STDERR.  
  The only argument passed to this function is the ```stderr``` string. Example:  

```javascript
  function camelHarnessStderr(stderr) {
      console.log('Perl script STDERR:\n'+ stderr);
  }
```

* **errorFunction:**  
  This is the name of the function that will be executed every time there is an error code from a Perl script.  
  The only argument passed to this function is the ```error``` object. Example:  

```javascript
  function camelHarnessError(error) {
      console.log(error.stack); 
      console.log('Perl script error code: '+ error.code); 
      console.log('Perl script signal received: '+ error.signal);
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
  Form data could be easily acquired using ```jQuery``` like that: ```var formData = $("#form-id").serialize();```  
  Note that CamelHarness.js itself does not depend on ```jQuery```.  
  
## License
  
This program is free software;  
you can redistribute it and/or modify it under the terms of the GNU General Public License,  
as published by the Free Software Foundation; either version 3 of the License,  
or (at your option) any later version.  
This program is distributed in the hope that it will be useful, but WITHOUT A NY WARRANTY;  
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
  
## Author
  
Dimitar D. Mitov, 2016.
