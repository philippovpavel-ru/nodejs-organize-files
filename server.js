const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();

// Получение интервала и времени работы из переменных окружения
const interval = parseInt(process.env.INTERVAL, 10) || 1000; // Интервал в миллисекундах
const duration = parseInt(process.env.DURATION, 10) || 5000; // Продолжительность в миллисекундах

// Обработчик для корневого пути
app.get('/', (req, res) => {
  console.log('Received GET request');

  // Запуск таймера для вывода текущего времени в консоль
  const intervalId = setInterval(() => {
    const currentTime = new Date().toUTCString();
    console.log(currentTime);
  }, interval);

  // Остановка таймера через заданное время и возврат текущей даты и времени клиенту
  setTimeout(() => {
    clearInterval(intervalId);
    const endTime = new Date().toUTCString();
    res.send(`Current UTC time: ${endTime}\n`);
  }, duration);
});

// Функция организации файлов
async function organizeFiles(srcDir, destDir, deleteSrc = false) {
  await fs.mkdir(destDir, { recursive: true });
  console.log(`Created directory: ${destDir}`);

  await processDirectory(srcDir, destDir);

  if (deleteSrc) {
    await fs.rmdir(srcDir, { recursive: true });
    console.log(`Deleted source directory: ${srcDir}`);
  }
}

async function processDirectory(currentDir, destDir) {
  const items = await fs.readdir(currentDir, { withFileTypes: true });

  for (const item of items) {
    const currentItemPath = path.join(currentDir, item.name);

    if (item.isDirectory()) {
      await processDirectory(currentItemPath, destDir);
    } else {
      const firstLetter = item.name.charAt(0).toUpperCase();
      const newDir = path.join(destDir, firstLetter);

      await fs.mkdir(newDir, { recursive: true });

      const destFilePath = path.join(newDir, item.name);
      await fs.rename(currentItemPath, destFilePath);

      console.log(`Moved file: ${item.name} to ${newDir}`);
    }
  }
}

// Маршрут для организации файлов
app.get('/organize', async (req, res) => {
  const srcDir = req.query.src;
  const destDir = req.query.dest;
  const deleteSrc = req.query.delete === 'true';

  if (!srcDir || !destDir) {
    res.status(400).send('Source and destination directories are required.');
    return;
  }

  try {
    await organizeFiles(srcDir, destDir, deleteSrc);
    res.send('File organization complete.');
  } catch (err) {
    console.error('Error organizing files:', err);
    res.status(500).send('Error organizing files.');
  }
});

// Запуск сервера на порту 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
