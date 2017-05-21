const express = require('express');
const bodyParser = require('body-parser');

const inventory = require("./lib/inventory");
const conversation = new (require("./lib/conversation"))();

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

router.post('/conversation/message/', function(req, res) {
  conversation.processMessage(req.body.message, req.body.conversationContext).then((response) => {
    res.json(response);
  });
});

app.use('/api', router);
app.listen(port, host, function(){
  console.log("listening on " + host + ":" + port);
});
