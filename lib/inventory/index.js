const request = require("request");
const cheerio = require('cheerio');

const location_data = {
  "Austin History Center": {
    foursquare_id: "",
    location: {
      lat: 30.271713, 
      lon: -97.745898,
    }
  },
  "Carver Branch": {
    foursquare_id: "",
    location: {
      lat: 30.269592,
      lon: -97.724229,
    }
  },
  "Cepeda Branch": {
    foursquare_id: "",
    location: {
      lat: 30.259125, 
      lon: -97.708803,
    }
  },
  "Faulk Central Library": {
    foursquare_id: "",
    location: {
      lat: 30.271317, 
      lon: -97.745978,
    }
  },
  "Hampton Branch at Oak Hill": {
    foursquare_id: "",
    location: {
      lat: 30.217604, 
      lon: -97.855016,
    }
  },
  "Howson Branch": {
    foursquare_id: "",
    location: {
      lat: 30.298225, 
      lon: -97.767561,
    }
  },
  "Little Walnut Creek Branch": {
    foursquare_id: "",
    location: {
      lat: 30.363626, 
      lon: -97.698343,
    }
  },
  "Manchaca Road Branch": {
    foursquare_id: "",
    location: {
      lat: 30.216467, 
      lon: -97.797273,
    }
  },
  "Milwood Branch": {
    foursquare_id: "",
    location: {
      lat: 30.422224, 
      lon: -97.716090,
    }
  },
  "North Village Branch": {
    foursquare_id: "",
    location: {
      lat: 30.362167, 
      lon: -97.730478,
    }
  },
  "Old Quarry Branch": {
    foursquare_id: "",
    location: {
      lat: 30.353176, 
      lon: -97.755394,
    }
  },
  "Pleasant Hill Branch": {
    foursquare_id: "",
    location: {
      lat: 30.192284, 
      lon: -97.777145,
    }
  },
  "Ruiz Branch": {
    foursquare_id: "",
    location: {
      lat: 30.229839, 
      lon: -97.706957,
    }
  },
  "Southeast Austin Community Branch": {
    foursquare_id: "",
    location: {
      lat: 30.187672, 
      lon: -97.742023,
    }
  },
  "Spicewood Springs Branch": {
    foursquare_id: "",
    location: {
      lat: 30.433718, 
      lon: -97.773081,
    }
  },
  "St. John Branch": {
    foursquare_id: "",
    location: {
      lat: 30.332041, 
      lon: -97.693698,
    }
  },
  "Terrazas Branch": {
    foursquare_id: "",
    location: {
      lat: 30.259870, 
      lon: -97.733461,
    }
  },
  "Twin Oaks Branch": {
    foursquare_id: "",
    location: {
      lat: 30.248661, 
      lon: -97.762365,
    }
  },
  "University Hills Branch": {
    foursquare_id: "",
    location: {
      lat: 30.308664, 
      lon: -97.666545,
    }
  },
  "Willie Mae Kirk Branch": {
    foursquare_id: "",
    location: {
      lat: 30.272930,
      lon: -97.699748,
    }
  },
  "Windsor Park Branch": {
    foursquare_id: "",
    location: {
      lat: 30.311499, 
      lon: -97.690303,
    }
  },
  "Yarborough Branch": {
    foursquare_id: "",
    location: {
      lat: 30.323344, 
      lon: -97.740869,
    }
  },
};

const requestAvailability = (book, callback) => {
  request(`https://austin.bibliocommons.com${book.availability_endpoint}`, function (error, response, html) {
    if (!error) {
      try {
        const $ = cheerio.load(html);

        $(".responsive_details_table tbody tr").each(function() {
          const location = {
            item_branch_name: cheerio(this).find("td[testid=item_branch_name]").text().replace(/^\s*/, "").replace(/\s*$/, ""),
            item_status: cheerio(this).find("td[testid=item_status]").text().replace(/^\s*/, "").replace(/\s*$/, "")
          };
          
          location.location_details = location_data[location.item_branch_name];
          book.availability_locations.push(location);
        });
        callback(book);
      } catch (e) {
        //todo: meaningful error
        console.log("ERROR", e);
        callback(book);
      }
    } else {
      //todo: meaningful error
      callback(book);
    }
  });
};

const requestBook = (isbn, callback) => {
  request(`https://austin.bibliocommons.com/search?custom_query=isbn%3A(${isbn})&suppress=true&custom_edit=true`, function (error, response, html) {
    if (!error) {
      const $ = cheerio.load(html);
      const first = $(".list_item_outer").first();

      requestAvailability({
        title: first.find("span.title").text(),
        author: first.find("span.author a").text(),
        availabilty: first.find("span.availability a").text(),
        availability_endpoint: first.find("span.availability a").attr("href"),
        availability_locations: [],
      }, (book)=>{
        callback(book);
      });
    } else {
      callback({});
    }
  });
};


const findBookByTitle = (title, callback) => {
  request(`https://austin.bibliocommons.com/search?custom_edit=false&custom_query=title%3A%28${uriencode(title)}%29+formatcode%3A%28BK+%29&display_quantity=100`, function (error, response, html) {
    if (!error) {
      const $ = cheerio.load(html);
      // const first = $(".list_item_outer").first();
      
      //todo: go through titles and find the longest match
      /*

      requestAvailability({
        title: first.find("span.title").text(),
        author: first.find("span.author a").text(),
        availabilty: first.find("span.availability a").text(),
        availability_endpoint: first.find("span.availability a").attr("href"),
        availability_locations: [],
      }, (book)=>{
        callback(book);
      });
      */
    } else {
      callback({});
    }
  });
};


module.exports = {
  requestAvailability,
  requestBook,
  location_data,
};