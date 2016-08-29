CamelHarness.js
--------------------------------------------------------------------------------
  
```CamelHarness.js``` is a small JavaScript library that can start asynchronously and with no timeout [Perl 5] (https://www.perl.org/) scripts from applications based on [Electron] (http://electron.atom.io/) or [NW.js] (http://nwjs.io/).
  
## Node.js Module Dependencies
All dependencies of CamelHarness.js are available inside [Electron] (http://electron.atom.io/) and [NW.js] (http://nwjs.io/).
* ```child_process```
* ```fs```
* ```os```
* ```path```
  
## API
  ```camelHarness(scriptFullPath, stdoutFunction, stderrFunction, errorFunction, exitFunction, method, formData);```  
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
  Form data can be easily acquired using ```jQuery``` like that: ```var formData = $("#form-id").serialize();```  
  Note that ```CamelHarness.js``` itself does not depend on ```jQuery```.  
  ```formData``` is mandatory parameter if ```method``` is set.  
  
## Perl Interpreter
```CamelHarness.js``` tries to find either a portable Perl like [Strawberry Perl] (http://strawberryperl.com/) PortableZIP edition distributed together with the ```Electron``` or ```NW.js``` binary or any other Perl on PATH. A portable Perl interpreter has to be placed inside ```{Electron_or_NW.js_binary_directory}/perl/bin``` folder.  
  
## Security
```CamelHarness.js``` executes all Perl scripts with the ```fork``` core function banned using the command line switch ```-M-ops=fork```. ```fork``` is banned to avoid orphan processes, which may be created if this function is carelessly used.  

## License
  
This program is free software;  
you can redistribute it and/or modify it under the terms of the GNU General Public License,  
as published by the Free Software Foundation; either version 3 of the License,  
or (at your option) any later version.  
This program is distributed in the hope that it will be useful, but WITHOUT A NY WARRANTY;  
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
  
## Author
  
Dimitar D. Mitov, 2016.
