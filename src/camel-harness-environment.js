"use strict";

// camel-harness
// Node.js - Electron - NW.js controller for Perl scripts
// camel-harness is licensed under the terms of the MIT license.
// Copyright (c) 2016 - 2018 Dimitar D. Mitov

// THE SOFTWARE IS PROVIDED "AS IS",
// WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR
// THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Set script environment:
module.exports.setEnvironment = function (script) {
  let scriptEnvironment;

  // Choose between inherited environment and new environment:
  if (typeof script.environment === "object") {
    scriptEnvironment = script.environment;
  } else {
    scriptEnvironment = process.env;
  }

  // Handle GET requests:
  if (script.requestMethod === "GET") {
    scriptEnvironment.REQUEST_METHOD = "GET";
    scriptEnvironment.QUERY_STRING = script.inputData;
  }

  // Handle POST requests:
  if (script.requestMethod === "POST") {
    scriptEnvironment.REQUEST_METHOD = "POST";
    scriptEnvironment.CONTENT_LENGTH = script.inputData.length;
  }

  return scriptEnvironment;
};
