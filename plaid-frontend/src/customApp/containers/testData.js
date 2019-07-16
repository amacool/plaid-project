export const auth = {
  "accounts": [
    {
      "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
      "balances": {
        "available": 100,
        "current": 110,
        "limit": null,
        "iso_currency_code": "USD",
        "unofficial_currency_code": null,
      },
      "mask": "0000",
      "name": "Plaid Checking",
      "official_name": "Plaid Gold Standard 0% Interest Checking",
      "subtype": "checking",
      "type": "depository"
    }
  ],
  "numbers": {
    "ach": [{
      "account": "9900009606",
      "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
      "routing": "011401533",
      "wire_routing": "021000021"
    }],
    "eft": []
  }
};

export const transactions = {
  "accounts": ["vokyE5Rn6vHKqDLRXEn5fne7LwbKPLIXGK98d", "XA96y1wW3xS7wKyEdbRzFkpZov6x1ohxMXwep"],
  "transactions": [{
    "account_id": "vokyE5Rn6vHKqDLRXEn5fne7LwbKPLIXGK98d",
    "amount": 2307.21,
    "iso_currency_code": "USD",
    "unofficial_currency_code": null,
    "category": [
      "Shops",
      "Computers and Electronics"
    ],
    "category_id": "19013000",
    "date": "2017-01-29",
    "location": {
      "address": "300 Post St",
      "city": "San Francisco",
      "region": "CA",
      "postal_code": "94108",
      "country": "US",
      "lat": null,
      "lon": null
    },
    "name": "Apple Store",
    "payment_meta": Object,
    "pending": false,
    "pending_transaction_id": null,
    "account_owner": null,
    "transaction_id": "lPNjeW1nR6CDn5okmGQ6hEpMo4lLNoSrzqDje",
    "transaction_type": "place"
  }, {
    "account_id": "XA96y1wW3xS7wKyEdbRzFkpZov6x1ohxMXwep",
    "amount": 78.5,
    "iso_currency_code": "USD",
    "unofficial_currency_code": null,
    "category": [
      "Food and Drink",
      "Restaurants"
    ],
    "category_id": "13005000",
    "date": "2017-01-29",
    "location": {
      "address": "262 W 15th St",
      "city": "New York",
      "region": "NY",
      "postal_code": "10011",
      "country": "US",
      "lat": 40.740352,
      "lon": -74.001761
    },
    "name": "Golden Crepes",
    "payment_meta": Object,
    "pending": false,
    "pending_transaction_id": null,
    "account_owner": null,
    "transaction_id": "4WPD9vV5A1cogJwyQ5kVFB3vPEmpXPS3qvjXQ",
    "transaction_type": "place"
  }],
  // "item": {Object},
  "total_transactions": Number
};

export const accounts = {
  "accounts": [{
    "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
    "balances": {
      "available": 100,
      "current": 110,
      "limit": null,
      "iso_currency_code": "USD",
      "unofficial_currency_code": null,
    },
    "mask": "0000",
    "name": "Plaid Checking",
    "official_name": "Plaid Gold Checking",
    "subtype": "checking",
    "type": "depository",
    "verification_status": null
  }, {
    "account_id": "6Myq63K1KDSe3lBwp7K1fnEbNGLV4nSxalVdW",
    "balances": {
      "available": null,
      "current": 410,
      "limit": 2000,
      "iso_currency_code": "USD",
      "unofficial_currency_code": null,
    },
    "mask": "3333",
    "name": "Plaid Credit Card",
    "official_name": "Plaid Diamond Credit Card",
    "subtype": "credit card",
    "type": "credit"
  }],
  "item": "",
  "request_id": "m8MDnv9okwxFNBV"
};

export const balance = {
  "accounts": [{
    "account_id": "QKKzevvp33HxPWpoqn6rI13BxW4awNSjnw4xv",
    "balances": {
      "available": 100,
      "current": 110,
      "limit": null,
      "iso_currency_code": "USD",
      "unofficial_currency_code": null
    },
    "mask": "0000",
    "name": "Plaid Checking",
    "official_name": "Plaid Gold Checking",
    "subtype": "checking",
    "type": "depository"
  }],
  "item": "",
  "request_id": "m8MDnv9okwxFNBV"
};