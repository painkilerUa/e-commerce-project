"use strict"
const manage = require('../../../manage');
const log = require('../../../utils/log');
const fs = require('fs');
const path = require('path')
const updatePrice = require('../../../update_price/update-price.js');

module.exports = function(req, res){
    if (req.user.scope !== 'm_manager') {
        res.status(401).send('Insufficient rights for this action')
        return
    }
    if(req.files && req.files.length){
        let savePriceFileChain = Promise.resolve();
        for (let price of req.files) {
            savePriceFileChain = savePriceFileChain.then(addPriceFilePromise(price));
        }
        savePriceFileChain.then((resolve) => {
            res.send({type: 'prices_file', success: true});
            return
        }).catch((err) => {
            res.status(500).send("Files has been successfully updated");
        })

        function addPriceFilePromise(price){
            return new Promise((resolve, reject) => {
                let filePath = './update_price/prices/' + price.originalname;
                fs.writeFile(filePath, price.buffer, (err) => {
                    if (err) reject(err);
                    resolve('The file has been saved!');
                });
            })
        }
    }else {
        updatePrice(res);
    }
}

