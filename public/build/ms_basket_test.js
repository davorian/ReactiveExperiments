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

},{}],2:[function(require,module,exports){
'use strict';

var _ms_basket = require('./ms_basket');

var _ms_basket2 = _interopRequireDefault(_ms_basket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var testData = {
  td1: { products: ['S01', 'B01'], basketTotal: 3785 },
  td2: { products: ['J01', 'J01'], basketTotal: 5437 },
  td3: { products: ['J01', 'B01'], basketTotal: 6085 },
  td4: { products: ['S01', 'S01', 'J01', 'J01', 'J01'], basketTotal: 9827 }
};

var productCatalog = {
  B01: { code: 'B01', price: 2495, product: 'Blouse' },
  J01: { code: 'J01', price: 3295, product: 'Jeans' },
  S01: { code: 'S01', price: 795, product: 'Socks' }
};

var deliveryRules = [{ value: 5000, cost: 495 }, { value: 9001, cost: 295 }, //including 50 as 2.95
{ value: 9002, cost: 0 //including 90 as free
}];

var specialOffers = {
  B01: function B01(blouseCount, blousePrice) {
    return blouseCount * blousePrice;
  },
  J01: function J01(jeansCount, jeansPrice) {
    return jeansCount > 1 ? Math.floor(jeansCount / 2) * (jeansPrice * 1.5) + jeansCount % 2 * jeansPrice : jeansCount * jeansPrice;
  },
  S01: function S01(socksCount, socksPrice) {
    return socksCount * socksPrice;
  }
};

function testMSBasket() {
  var basket = new _ms_basket2.default({ productCatalog: productCatalog, deliveryRules: deliveryRules, specialOffers: specialOffers });
  for (var data in testData) {
    basket.init();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = testData[data].products[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var product = _step.value;

        basket.add(product);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    console.log('basket.total() ' + basket.total());
    console.log('data.basketTotal ' + testData[data].basketTotal);
    console.log(basket.total() === testData[data].basketTotal);
  }
}

function testAdd() {
  var basket = new _ms_basket2.default({ productCatalog: productCatalog, deliveryRules: deliveryRules, specialOffers: specialOffers });
  basket.add('J01');
  console.log('testAdd ', basket.selectedProductCounts['J01'].count === 1);
}

function testSpecialOffer(productCode) {
  var price = productCatalog[productCode].price;
  var specialOffer = specialOffers[productCode];
  if (productCode === 'S01' || productCode === 'B01') {
    console.log('testSpecialOfferOdd', productCode, specialOffer(11, price) === 11 * price);
    console.log('testSpecialOfferEven', productCode, specialOffer(10, price) === 10 * price);
  } else {
    console.log('testSpecialOfferOdd', productCode, specialOffer(11, price) === 6 * price + 2.5 * price);
    console.log('testSpecialOfferEven', productCode, specialOffer(10, price) === 5 * price + 2.5 * price);
  }
}

testAdd();
testSpecialOffer('J01');
testSpecialOffer('B01');
testSpecialOffer('S01');
testMSBasket();

},{"./ms_basket":1}]},{},[2]);
