const express = require('express');
const bodyParser = require('body-parser');

const inventory = require("./lib/inventory");
const conversation = new (require("./lib/conversation"))();

const foursquare = require("./lib/foursquare");

const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

router.get('/inventory/book/:isbn', function(req, res) {
  inventory.requestBook(req.params.isbn, function(book){
    res.json(book);   
  });
});

router.get('/inventory/title/:title', function(req, res) {
  inventory.requestBookByTitle(req.params.title, function(book){
    res.json(book);   
  });
});


router.post('/conversation/message/', function(req, res) {
  conversation.processMessage(req.body.message, req.body.conversationContext).then((response) => {
    res.json(response);
  });
});

router.get('/foursquare/venues/:lat/:lon', function(req, res) {
  foursquare.getVenues(req.params.lat, req.params.lon, function(venues){
    res.json(venues);
  });
});

router.get('/foursquare/branch/:branch', function(req, res) {
  foursquare.getVenuesNearBranch(req.params.branch, function(venues){
    res.json(venues);
  });
});




app.use('/api', router);
app.listen(port, host, function(){
  console.log("listening on " + host + ":" + port);
});
