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
function setInputVariables (settings) {
  // Handle GET requests:
  if (settings.requestMethod === "GET") {
    settings.environment.REQUEST_METHOD = "GET";
    settings.environment.QUERY_STRING = settings.inputData;
  }

  // Handle POST requests:
  if (settings.requestMethod === "POST") {
    settings.environment.REQUEST_METHOD = "POST";
    settings.environment.CONTENT_LENGTH = settings.inputData.length;
  }

  return settings.environment;
}

// Set script environment:
module.exports.setEnvironment = function (settings) {
  // Choose between inherited environment and new environment:
  if (typeof settings.environment !== "object") {
    settings.environment = process.env;
  }

  // Set environment variables for GET and POST requests, if any:
  settings.environment = setInputVariables(settings);

  return settings.environment;
};
