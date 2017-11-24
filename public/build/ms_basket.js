(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MSBasket = function () {
  function MSBasket(_ref) {
    var productCatalog = _ref.productCatalog,
        deliveryRules = _ref.deliveryRules,
        specialOffers = _ref.specialOffers;

    _classCallCheck(this, MSBasket);

    this.productCatalog = productCatalog;
    this.deliveryRules = deliveryRules;
    this.specialOffers = specialOffers;
    this.init();
  }

  _createClass(MSBasket, [{
    key: "init",
    value: function init() {
      this.selectedProductCounts = {};
      this.selectedProductTotals = {};
    }
  }, {
    key: "add",
    value: function add(productCode) {
      if (this.selectedProductCounts[productCode]) {
        this.selectedProductCounts[productCode].count++;
      } else {
        this.selectedProductTotals[productCode] = { code: productCode, total: 0 };
        this.selectedProductCounts[productCode] = { code: productCode, count: 1 };
      }
    }
  }, {
    key: "total",
    value: function total() {
      var sum = void 0;
      var sumExcludingDelivery = 0;
      var deliveryCharge = 0;

      for (var productCode in this.selectedProductCounts) {
        sumExcludingDelivery += this.selectedProductTotals[productCode].total = this.specialOffers[productCode](this.selectedProductCounts[productCode].count, this.productCatalog[productCode].price);
      }

      for (var predicate in this.deliveryRules) {
        if (sumExcludingDelivery < this.deliveryRules[predicate].value) {
          deliveryCharge = Math.max(deliveryCharge, this.deliveryRules[predicate].cost);
        }
      }
      sum = sumExcludingDelivery + deliveryCharge;

      return Math.floor(sum);
    }
  }]);

  return MSBasket;
}();

exports.default = MSBasket;

},{}]},{},[1]);
