'use strict';

var _Rx = require('rxjs/Rx');

var _Rx2 = _interopRequireDefault(_Rx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//PART 0 - PROMISES
/*
const promise = new Promise((resolve, reject) => {
  console.log('IN PROMISE');
  resolve('hey');
});
promise.then(item => console.log(item));*/

//------------------
//PART 1 - OBSERVABLES 1 WITH ERRORS and subscriptions
//note diff ways of subscribing:
// {next, error, complete}
// (next, error, complete)
/*const simple$ = new Rx.Observable(observer => {
    console.log('Generating observable');
    setTimeout(() => {
      observer.next("An item!");
      setTimeout(() => {
        observer.next("Another item!");
        observer.complete();
      }, 1000);
    }, 1000);
});

const error$ = new Rx.Observable(observer => {
   observer.error(new Error({whoa: "Blegh"}));
});

error$.subscribe(
  item => console.log(`ERR.next ${item}`),      //will not run
  error => console.log(`ERR.error ${error.stack}`),   //WILL RUN run
  () => console.log('ERR.complete')             //will not run
);


simple$.subscribe(
  item => console.log(`ONE.next ${item}`),      //next
  error => console.log(`ONE.error ${error}`),   //error
  () => console.log('ONE.complete')             //complete
);

setTimeout(() => {
  simple$.subscribe({
    next: item => console.log(`TWO.next ${item}`),
    error(error) { console.log(`TWO.error ${error}`)},
    complete: () => console.log("TWO.complete")
  })
},  3000);*/

//------------------
//PART 2 - OBSERVABLES 1 WITH Factory for timed emission of observer with setInterval triggering next  observables and subscribers
function createInterval$(time) {
  return new _Rx2.default.Observable(function (observer) {
    var index = 0;
    var interval = setInterval(function () {
      console.log('Generating ' + index);
      observer.next(index++);
    }, time);
    //on unsubscribe
    return function () {
      clearInterval(interval);
    };
  });
}

function createSubscriber(tag) {
  return {
    next: function next(item) {
      console.log(tag + '.next ' + item);
    },
    error: function error(_error) {
      console.log(tag + '.error ' + (_error.stack || _error));
    },
    complete: function complete() {
      console.log(tag + '.complete');
    }
  };
}

// an operator is an observable that wraps another observable.
function take$(sourceObservable$, amount) {
  return new _Rx2.default.Observable(function (observer) {
    //is subscribed to createSubscriber("two");
    var count = 0;
    var sourceSubscription = sourceObservable$.subscribe({
      next: function next(item) {
        //sourceObservables next (everySecond$) triggers innerObservables (observer)'s next!
        observer.next(item);
        if (++count >= amount) {
          this.complete();
          observer.complete();
        }
      },
      error: function error(_error2) {
        observer.error(_error2);
      },

      complete: function complete() {
        return console.log('take ' + amount + ' complete');
      }
    });

    return function () {
      return sourceSubscription.unsubscribe();
    }; //
  });
}

var everySecond$ = createInterval$(1000);
//const subscription = everySecond$.subscribe(createSubscriber('one'));

var $firstFiveSeconds$ = take$(everySecond$, 5);
var subscription = $firstFiveSeconds$.subscribe(createSubscriber('two'));

/*setTimeout(()=>{
  subscription.unsubscribe();
  //without clearInterval the
  // on unsubscription will not call next
  // but will still call setInterval triggering the Generating index
  // console log.
},3500);*/