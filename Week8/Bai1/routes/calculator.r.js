const express = require('express');
const router = express.Router();
const calculatorC = require('../ctrlers/calculator.c');
const calculatorM = require('../models/calculator.m');

const calculate = router.get('/calculate', calculatorC.calculate);
const index = router.get('/', (req, res) => {
    res.render('calculator', calculatorM);
});

module.exports = {
    calculate,
    index
};