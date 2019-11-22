'use strict';
const request = require('request');

const CLIENT = process.env.CLIENT;
const SECRET = process.env.SECRET;
const PAYPAL_API = process.env.PAYPAL_API;
const site_url = process.env.site_url;

exports.setupPayment = function(req, res) {
  const { total, currency, id } = req.body;
  request.post(PAYPAL_API + '/v1/payments/payment',
    {
      auth:
        {
          user: CLIENT,
          pass: SECRET
        },
      body:
        {
          intent: 'sale',
          payer:
            {
              payment_method: 'paypal'
            },
          transactions: [
            {
              amount:
                {
                  total,
                  currency
                }
            }],
          redirect_urls:
            {
              return_url: site_url,
              cancel_url: site_url
            }
        },
      json: true
    }, function(err, response)
    {
      if (err)
      {
        console.error(err);
        return res.sendStatus(500);
      }
      // 3. Return the payment ID to the client
      res.json(
        {
          id
        });
    });
};

exports.executePayment = function(req, res) {
  const paymentID = req.body.paymentID;
  const payerID = req.body.payerID;
  const total = req.body.total;
  const currency = req.body.currency;
  // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
  request.post(PAYPAL_API + '/v1/payments/payment/' + paymentID +
    '/execute',
    {
      auth:
        {
          user: CLIENT,
          pass: SECRET
        },
      body:
        {
          payer_id: payerID,
          transactions: [
            {
              amount:
                {
                  total,
                  currency
                }
            }]
        },
      json: true
    },
    function(err, response) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      res.json({
        status: 'success'
      });
    });
};
