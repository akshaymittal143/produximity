const request = require("request");
const cheerio = require('cheerio');

const location_data = {
  "Austin History Center": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "Carver Branch": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "Cepeda Branch": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "Faulk Central Library": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "Hampton Branch at Oak Hill": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "Howson Branch": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "Little Walnut Creek Branch": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "Manchaca Road Branch": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "Milwood Branch": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "North Village Branch": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "Old Quarry Branch": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "Pleasant Hill Branch": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "Ruiz Branch": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "Southeast Austin Community Branch": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "Spicewood Springs Branch": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "St. John Branch": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "Terrazas Branch": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "Twin Oaks Branch": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "University Hills Branch": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "Virtual Library": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "Willie Mae Kirk Branch": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "Windsor Park Branch": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
    }
  },
  "Yarborough Branch": {
    foursquare_id: "",
    location: {
      lat: 0,
      lon: 0,
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

module.exports = {
  requestAvailability,
  requestBook,
  location_data,
};