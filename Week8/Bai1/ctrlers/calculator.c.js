const model = require('../models/calculator.m');

module.exports = {
    calculate: (req, res) => {
        const { x, y, operation } = req.query;

        // Convert x and y to numbers (assuming they are expected to be numbers)
        const numX = parseFloat(x);
        const numY = parseFloat(y);

        // Perform the calculation based on the operation
        let result;
        switch (operation) {
            case 'plus':
                result = numX + numY;
                break;
            case 'minus':
                result = numX - numY;
                break;
            case 'multi':
                result = numX * numY;
                break;
            case 'divide':
                result = numX / numY;
                break;
            default:
                // Handle invalid operation
                res.status(400).send('Invalid operation');
                return;
        }

        // Send the result back to the client
        res.render('calculator', {
            x: numX,
            y: numY,
            operation,
            result,
        });
    }
};