const request = require("request");
const cheerio = require('cheerio');

const _processtBookTitleListHtml = (html, callback) => {
    try {
      const $ = cheerio.load(html);

      const books = [];
      
      $("tr").each(function() {
        const title = cheerio(this).find(".bookTitle").text().replace(/^\s*/, "").replace(/\s*$/, "").replace(/\([^\)]*\)$/, "").replace(/\s*$/, "");
        if (title.length < 64) {
          books.push({  
           value:title,
           created:(new Date()).toISOString(),
           updated:(new Date()).toISOString(),
           metadata:null,
           synonyms:[]
          });
        }
      });
      callback(books);
    } catch (e) {
      console.log("ERROR", e);
      callback([]);
    }
}

const _requestBookTitleList = (html, listName, page, callback) => {
  const books = [];
  if (html) {
    _processtBookTitleListHtml(html, (titles)=>{
      callback(titles);  
    });
  } else {
    request(`https://www.goodreads.com/list/show/${listName}?page=${page}`, function (error, response, html) {
    if (!error) {
      _processtBookTitleListHtml(html, (titles)=>{
        callback(titles);  
      });
    } else {
      callback([]);
    }
  });
  } 
};

const _requestPages = (listName, titles, pageNumber, pageCount, callback) => {
  if (pageNumber <= pageCount) {
    _requestBookTitleList(false, listName, pageNumber, (pageTitles)=>{
      titles = [...titles, ...pageTitles];
      _requestPages(listName, titles, pageNumber+1, pageCount, callback);
    });
  } else {
    callback(titles);
  }
}

const requestBookTitles = (listName, callback) => {
  let titleList = [];
  request(`https://www.goodreads.com/list/show/${listName}`, function (error, response, html) {
    if (!error) {
      try {
        const $ = cheerio.load(html);
        const pageCount = parseInt($(".pagination").find("a[class!='next_page']").last().text()) || 1;
        
        _requestBookTitleList(html, listName, 1, (titles)=>{
          _requestPages(listName, titles, 2, pageCount, (titles)=>{
            callback(titles);
          });
        });
      } catch (e) {
        //todo: meaningful error
        console.log("ERROR", e);
        callback([]);
      }
    } else {
      //todo: meaningful error
      callback([]);
    }
  });
};


module.exports = {
  requestBookTitles,
};