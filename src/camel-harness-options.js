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

// Handle all environment variables needed for GET and POST request methods:
function setInputEnvironmentVariables (settings) {
  // Handle GET requests:
  if (settings.requestMethod === "GET") {
    settings.options.env.REQUEST_METHOD = "GET";
    settings.options.env.QUERY_STRING = settings.inputData;
  }

  // Handle POST requests:
  if (settings.requestMethod === "POST") {
    settings.options.env.REQUEST_METHOD = "POST";
    settings.options.env.CONTENT_LENGTH = settings.inputData.length;
  }

  return settings.options.env;
}

// Set script environment:
function setEnvironment (settings) {
  // Choose between inherited environment and new environment:
  if (typeof settings.options.env !== "object") {
    settings.options.env = process.env;
  }

  // Set environment variables for GET and POST requests
  // if 'inputData' is available:
  if (settings.inputData) {
    settings.options.env = setInputEnvironmentVariables(settings);
  }

  return settings.options.env;
}

module.exports.setOptions = function (settings) {
  // Set default options if 'options' are empty:
  if (typeof settings.options !== "object") {
    settings.options = {
      cwd: null,
      env: process.env
    };
  }

  settings.options.env = setEnvironment(settings);

  return settings.options;
};
