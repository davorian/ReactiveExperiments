import Rx from 'rxjs/Rx';

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
  return new Rx.Observable(observer => {
    let index = 0;
    let interval = setInterval(() => {
      console.log(`Generating ${index}`);
      observer.next(index++);
    }, time);
    //on unsubscribe
    return () => {
       clearInterval(interval);
    }
  })
}

function createSubscriber(tag) {
 return  {
    next(item) {console.log(`${tag}.next ${item}`);},
    error(error) { console.log(`${tag}.error ${error.stack || error}`);},
    complete() { console.log(`${tag}.complete`);}
  };
}

// an operator is an observable that wraps another observable.
function take$(sourceObservable$, amount) {
  return new Rx.Observable(observer => { //is subscribed to createSubscriber("two");
    let count = 0;
    const sourceSubscription = sourceObservable$.subscribe({
      next(item) {   //sourceObservables next (everySecond$) triggers innerObservables (observer)'s next!
        observer.next(item);
        if (++count >= amount) {
          this.complete();
          observer.complete();
        }
      },
      error(error){observer.error(error)},
      complete:()=>console.log(`take ${amount} complete`)
    });

    return () => sourceSubscription.unsubscribe();   //
  });
}

const everySecond$ = createInterval$(1000);
//const subscription = everySecond$.subscribe(createSubscriber('one'));

const $firstFiveSeconds$ = take$(everySecond$, 5);
const subscription = $firstFiveSeconds$.subscribe(createSubscriber('two'));


/*setTimeout(()=>{
  subscription.unsubscribe();
  //without clearInterval the
  // on unsubscription will not call next
  // but will still call setInterval triggering the Generating index
  // console log.
},3500);*/


