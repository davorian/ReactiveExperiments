import $ from 'jquery';
import Rx from "rxjs/Rx";

const $title = $("#title");
const $results = $("#results");

const keyUps$ = Rx.Observable.fromEvent($title, "keyup");
const queries$ = keyUps$
  .map(e=>e.target.value)
  .distinctUntilChanged()
  .debounceTime(500) //only produce a call if an new call has not been made in 250ms
  .switchMap(getItems)     //switchMap is flatMapLatest this is show emission of LI (lastIn) get result of it even if its not LILO, mergeMap is flatMap aka Think (<^> i.e. fork) SelectMany, forks lots of results come in asynchronously so not necessarily LILO!
  .subscribe(items => {
        $results.empty();
        $results.append(items.map(i => $(`<li />`).text(i)));
  });

//------------------------
//Library
function getItems(title) {
  console.log(`QueryXXXing ${title}`);
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve([title, "Item 2", `Another ${Math.random()}`]);
    }, 500 + (Math.random() * 2000));
  });
}