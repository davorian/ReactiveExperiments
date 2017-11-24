import $ from "jquery";

const $title = $("#title");
const $results = $("#results");

let lastQuery = null;
let lastTimeout = null;
let nextQueryId = 0;
$title.on("keyup", e => {
   const title = e.target.value;
   if (title === lastQuery) {
     return;
   }

   lastQuery = title;

   if(lastTimeout)
     window.clearTimeout(lastTimeout); //debouncing -
    // if called again
    // within 500ms then reset count to zero

   let ourQueryId = ++nextQueryId;
   console.log('ourQueryId', ourQueryId);

   lastTimeout = window.setTimeout(() => {
     getItems(title)
       .then(items => {
         if(ourQueryId != nextQueryId) //ensuring only the last query is shown
           return;
         
         $results.empty();

         const $items = items.map(item => $(`<li />`).text(item));
         $results.append($items);
       });
   }, 500); //There is no numeric throttling with this
  //because we have not set the max number of times the function
  //getTimeout can be called in a 500ms period
  //We DO have a type of throttling
  //in that we will not query again if the title has not changed.
  //We have also done a result throttle with the queryId logic, that prevents
  //the display of results that are not for our last query.


});


//------------------------
//Library
function getItems(title) {
  console.log(`Querying ${title}`);
  return new Promise((resolve, reject) => {
     window.setTimeout(() => {
       resolve([title, "Item 2", `Another ${Math.random()}`]);
     }, 500 + (Math.random() * 5000));
  });
}