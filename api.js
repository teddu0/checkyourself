const express = require("express");
// import express from "express";

const app = express();
app.use(express.json());

let storedString = null;
let timeoutId = null;

// Генерация случайной строки
function generateRandomString(length = 10) {
  return Math.random()
    .toString(36)
    .slice(2, 2 + length);
}

// Эндпоинт генерации строки
app.post("/generate", (req, res) => {
  storedString = generateRandomString();
  console.log(`Generated string: ${storedString}`);

  // Очистка через 5 минут
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    storedString = null;
    console.log("Stored string expired.");
  }, 1 * 60 * 1000);

  res.status(200).json({ message: "String generated", value: storedString });
});

// Эндпоинт проверки строки
app.post("/verify", (req, res) => {
  const { value } = req.body;

  if (!storedString) {
    return res.status(404).json({ message: "No stored string" });
  }

  if (value === storedString) {
    return res.status(200).json({ message: "Valid string", success: true });
  }

  return res.status(404).json({ message: "Invalid string", success: false });
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
