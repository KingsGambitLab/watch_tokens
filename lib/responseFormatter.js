"use strict";

/*
 * Restful API response formatter
 *
 */

const shortId = require('shortid');

function Result(data) {
  data = data || {};
  this.success = true;

  this.data = data || {};

  // Check if response has success
  this.isSuccess = function () {
    return this.success;
  };

  // Check if response is not success. More often not success is checked, so adding a method.
  this.isFailure = function () {
    return !this.isSuccess();
  };

  // Format data to hash
  this.toHash = function () {
    var s = {};
    if (this.success) {
      s.success = true;
      s.data = this.data;
    } else {
      s.success = false;
      if ( this.data instanceof Object && Object.keys( this.data ).length > 0 ) {
        //Error with data case.
        s.data = this.data;
      }
      s.errors = this.errors;
    }

    return s;
  };

  // Render final error or success response
  this.renderResponse = function (res, status) {
    status = status || 200;
    return res.status(status).json(this.toHash());
  };

  this.addError = function(errCode, errMsg, errFieldId) {
    this.success = false;
    if ( !this.errors ) {
      this.errors = [];
    }
    this.errors.push({
      errCode: errCode || ""
      ,errMsg: errMsg || "Something went wrong"
      ,errFieldId: errFieldId || null
    });
  }
}

const responseFormatter = {

  // Generate success response object
  successWithData: function (data) {
    return new Result(data);
  },

  // Generate error response object
  error: function(errCode, errMsg, errFieldId) {
    errCode = '' + errCode + ":" + shortId.generate() + '';
    if (errFieldId) {
      errCode = errFieldId + "*" + errCode;
    }
    console.error('### Error ### ' + errCode + ' ###');
    console.error('### Error MSG ### ' + errMsg + ' ###');
    const result = new Result();
    result.addError(errCode, errMsg, errFieldId);
    return result;
  },

  newResponse: function () {
    return new Result();
  }
};

module.exports = responseFormatter;