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

function getProperties(n) {
    const properties = [];
    if (n >= 0 && isPrime(n)) properties.push("prime");
    if (isPerfect(n)) properties.push("perfect");
    properties.push(n % 2 === 0 ? "even" : "odd");
    return properties;
}

app.get("/api/classify-number", async (req, res) => {
    const input = req.query.number?.trim();
    if (!input || !/^-?\d+$/.test(input)) {
        return res.status(400).json({
            number: "alphabet",
            error: true,
            message: "Invalid number. Please provide an integer.",
        });
    }
    
    const num = parseInt(input, 10);
    if (num < -Number.MAX_SAFE_INTEGER || num > Number.MAX_SAFE_INTEGER) {
        return res.status(400).json({ number: "alphabet", error: true });
    }
    
    const properties = getProperties(num);
    const digitSum = Math.abs(num)
        .toString()
        .split("")
        .reduce((sum, d) => sum + parseInt(d), 0);
    
    try {
        const funFactResponse = await axios.get(
            `http://numbersapi.com/${num}/math`
        );
        const funFact = funFactResponse.data;
        return res.json({
            number: num,
            is_prime: isPrime(num),
            is_perfect: isPerfect(num),
            properties,
            digit_sum: num < 0 ? -digitSum : digitSum,
            fun_fact: funFact,
        });
    } catch (error) {
        return res.json({
            number: num,
            is_prime: isPrime(num),
            is_perfect: isPerfect(num),
            properties,
            digit_sum: num < 0 ? -digitSum : digitSum,
            fun_fact: "No fun fact available.",
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


