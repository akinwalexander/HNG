const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) return false;
    }
    return true;
}

function isPerfect(n) {
    if (n < 1) return false;
    let sum = 1;
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) {
            sum += i;
            if (i !== n / i) sum += n / i;
        }
    }
    return sum === n && n !== 1;
}

function isArmstrong(n) {
    if (n < 0) return false;
    let sum = 0, temp = n, digits = n.toString().length;
    while (temp > 0) {
        sum += Math.pow(temp % 10, digits);
        temp = Math.floor(temp / 10);
    }
    return sum === n;
}

function digitSum(n) {
    return Math.abs(n).toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
}


app.get('/api/classify-number', async (req, res) => {
    const { number } = req.query;
    if (!number || number.trim() === "") {
        return res.status(400).json({
            error: true,
            message: "Missing input. Please provide a number as a query parameter."
        });
    }
    
    const num = parseInt(number);
    
    if (isNaN(num) || !Number.isInteger(num)) {
        return res.status(400).json({
            error: true,
            message: "Invalid input. Please provide a valid integer."
        });
    }
    const properties = [];
    if (isPrime(num)) properties.push("prime");
    if (isPerfect(num)) properties.push("perfect");
    if (isArmstrong(num)) properties.push("armstrong");
    properties.push(num % 2 === 0 ? "even" : "odd");
    
    try {
        const response = await axios.get(`http://numbersapi.com/${num}/math`);
        const funFact = response.data;
        res.json({
            number: num,
            is_prime: isPrime(num),
            is_perfect: isPerfect(num),
            properties,
            digit_sum: digitSum(num),
            fun_fact: funFact.trim(),
        });
    } catch (error) {
        res.json({
            number: num,
            is_prime: isPrime(num),
            is_perfect: isPerfect(num),
            properties,
            digit_sum: digitSum(num),
            fun_fact: "No fun fact available."
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
