# **Number Classification API**

## **Overview**

This **API classifies numbers based on their mathematical properties and provides a fun fact about them using the Numbers API.** It checks if a number is prime, perfect, Armstrong, even, or odd and returns a JSON response.

## **Features**

* Checks if a number is prime, perfect, Armstrong, even, or odd.

* Calculates the sum of the digits of the number.

* Fetches a fun fact about the number from the Numbers API.

* Handles errors and invalid inputs gracefully.

* Supports CORS (Cross-Origin Resource Sharing).

## **Endpoints**

**GET** `/api/classify-number`

## **Query Parameters:**

- number (integer) - The number to classify.

## **Example Request:**

**GET** `/api/classify-number?number=371`

## **Successful Response (200 OK):**

``` 
{
    "number": 371,
    "is_prime": false,
    "is_perfect": false,
    "properties": ["armstrong", "odd"],
    "digit_sum": 11,
    "fun_fact": "371 is an Armstrong number because 3^3 + 7^3 + 1^3 = 371"
}
```

## **Error Response (400 Bad Request):**

```
{
    "number": "invalid",
    "error": true
}
```