const express = require("express");
const cors = require("cors"); // Импортируем cors

const app = express();

// Middleware
app.use(cors()); // Включаем CORS
app.use(express.json()); // Парсим JSON-тело запроса

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
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    storedString = null;
    console.log("Stored string expired.");
  }, 5 * 60 * 1000); // 5 минут

  res.status(200).json({ message: "String generated", value: storedString });
});

// Эндпоинт проверки строки
app.post("/verify", (req, res) => {
  const { value } = req.body;

  if (!value) {
    return res.status(400).json({ message: "Value is required" });
  }

  if (!storedString) {
    return res.status(404).json({ message: "No stored string" });
  }

  if (value === storedString) {
    return res.status(200).json({ message: "Valid string", success: true });
  }

  return res.status(400).json({ message: "Invalid string", success: false });
});

// Запуск сервера
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
