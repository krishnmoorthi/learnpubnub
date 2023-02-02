var express = require('express');
var router = express.Router();
var pubnub = require('../scripts/pubnubService');
const biddingModel = require('../models/biddings');
var products = null;

/* GET home page. */
router.get('/', function (req, res, next) {
  const {
    readFileSync
  } = require('fs');
  const data = readFileSync('./products.json');
  products = JSON.parse(data);
  res.render('index', {
    title: 'Wine Worlds',
    products: products,
  });
});

router.post('/publish', async (req, res, next) => {
  var bidData = req.body;
  pubnub.publishMessage(bidData).then(() => {
    console.log('Bid published: ' + JSON.stringify(bidData));
  });
  var bidding = new biddingModel(bidData);
  try {
    await bidding.save();
    res.send(bidding);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;