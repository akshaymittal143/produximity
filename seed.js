const goodreadsImport = require("./lib/goodreads-import");

goodreadsImport.requestBookTitles("1.Best_Books_Ever", function(books){
  const uniques = [];
  const titles = [];
  for (let book of books) {
    const title = book.value.toLocaleLowerCase();
    if (titles.indexOf(title) === -1) {
      titles.push(title);
      uniques.push(book);
    }
  }
  
  console.log(JSON.stringify(uniques));
});