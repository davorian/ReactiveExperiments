import MSBasket from './ms_basket';

const testData = {
  td1: {products: ['S01', 'B01'], basketTotal: 3785},
  td2: {products: ['J01', 'J01'], basketTotal: 5437},
  td3: {products: ['J01', 'B01'], basketTotal: 6085},
  td4: {products: ['S01', 'S01', 'J01', 'J01', 'J01'], basketTotal: 9827}
};

const productCatalog = {
  B01: {code: 'B01', price: 2495, product: 'Blouse'},
  J01: {code: 'J01', price: 3295, product: 'Jeans'},
  S01: {code: 'S01', price: 795, product: 'Socks'}
};

const deliveryRules = [
  {value:5000, cost:495},  // < 50
  {value:9000, cost:295},  //including >=50 & <90 at 295
  {value:9001, cost:0}     //including >=90 as free
];

const specialOffers = {
  B01: (blouseCount, blousePrice) => blouseCount * blousePrice,
  J01: (jeansCount, jeansPrice) => jeansCount > 1 ?  Math.floor(jeansCount/2) * (jeansPrice * 1.5) + ((jeansCount % 2) * jeansPrice) : jeansCount * jeansPrice,
  S01: (socksCount, socksPrice) => socksCount * socksPrice
};

function testMSBasket() {
  let basket = new MSBasket({productCatalog, deliveryRules, specialOffers});
  for (let data in testData) {
    basket.init();
    for (let product of testData[data].products) {
      basket.add(product);
    }
    console.log('basket.total() '+ basket.total() );
    console.log('data.basketTotal '+ testData[data].basketTotal);
    console.log(basket.total() === testData[data].basketTotal);
  }
}

function testAdd() {
  let basket = new MSBasket({productCatalog, deliveryRules, specialOffers});
  basket.add('J01');
  console.log('testAdd ', basket.selectedProductCounts['J01'].count === 1);
}

function testSpecialOffer(productCode) {
  let price = productCatalog[productCode].price;
  let specialOffer = specialOffers[productCode];
  if (productCode === 'S01' || productCode === 'B01') {
    console.log('testSpecialOfferOdd', productCode, specialOffer(11, price) === 11 * price);
    console.log('testSpecialOfferEven', productCode, specialOffer(10, price) === 10 * price);
  } else {
    console.log('testSpecialOfferOdd', productCode, specialOffer(11, price) === (6 * price) + (2.5 * price));
    console.log('testSpecialOfferEven', productCode, specialOffer(10, price) === (5 * price) + (2.5 * price));
  }
}

testAdd();
testSpecialOffer('J01');
testSpecialOffer('B01');
testSpecialOffer('S01');
testMSBasket();