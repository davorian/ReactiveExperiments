class MSBasket {
  constructor({productCatalog, deliveryRules, specialOffers} ) {
    this.productCatalog = productCatalog;
    this.deliveryRules = deliveryRules;
    this.specialOffers = specialOffers;
    this.init();
    
  }

  init() {
    this.selectedProductCounts = {};
    this.selectedProductTotals = {};
  }

  add(productCode) {
    if(this.selectedProductCounts[productCode]) {
      this.selectedProductCounts[productCode].count++;
    } else {
      this.selectedProductTotals[productCode] = {code:productCode, total:0};
      this.selectedProductCounts[productCode] = {code:productCode, count:1};
    }
  }

  total() {
    let sum;
    let sumExcludingDelivery = 0;
    let deliveryCharge = 0;

    for (let productCode in this.selectedProductCounts) {
      sumExcludingDelivery += this.selectedProductTotals[productCode].total = this.specialOffers[productCode](this.selectedProductCounts[productCode].count, this.productCatalog[productCode].price);
    }

    for (let predicate in this.deliveryRules )  {
      if (sumExcludingDelivery < this.deliveryRules[predicate].value) {
        deliveryCharge = Math.max(deliveryCharge, this.deliveryRules[predicate].cost)
      }
    }
    sum = sumExcludingDelivery + deliveryCharge;

    return Math.floor(sum);
  };

}

export default MSBasket;
