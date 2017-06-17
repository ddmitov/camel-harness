'use strict';

// camel-harness
// Node.js - Electron - NW.js controller for Perl scripts
// camel-harness is licensed under the terms of the MIT license.
// Copyright (c) 2016 - 2017 Dimitar D. Mitov

// THE SOFTWARE IS PROVIDED "AS IS",
// WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR
// THE USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports.setArguments = function(script) {
  var interpreterArguments;

  // Interpreter arguments, if any, go before the script full path:
  if (script.interpreterSwitches !== undefined &&
      Array.isArray(script.interpreterSwitches)) {
    interpreterArguments = script.interpreterSwitches;
  } else {
    interpreterArguments = [];
  }

  // The full path of the script is the minimal interpreter argument:
  interpreterArguments.push(script.scriptFullPath);
  return interpreterArguments;
};
