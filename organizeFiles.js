const fs = require('fs');
const path = require('path');

function organizeFiles(srcDir, destDir, deleteSrc = false) {
  // Создаем итоговую папку
  fs.mkdir(destDir, { recursive: true }, (err) => {
    if (err) throw err;
    console.log(`Created directory: ${destDir}`);

    // Рекурсивно проходим по папкам
    processDirectory(srcDir, destDir, () => {
      // Удаляем исходную папку, если требуется
      if (deleteSrc) {
        fs.rmdir(srcDir, { recursive: true }, (err) => {
          if (err) throw err;
          console.log(`Deleted source directory: ${srcDir}`);
        });
      }
    });
  });
}

function processDirectory(currentDir, destDir, callback) {
  fs.readdir(currentDir, (err, items) => {
    if (err) throw err;

    let pending = items.length;
    if (!pending) return callback();

    items.forEach((item) => {
      const currentItemPath = path.join(currentDir, item);

      fs.stat(currentItemPath, (err, stats) => {
        if (err) throw err;

        if (stats.isDirectory()) {
          // Если это папка, рекурсивно обрабатываем ее
          processDirectory(currentItemPath, destDir, () => {
            if (!--pending) callback();
          });
        } else {
          // Если это файл, перемещаем его в соответствующую папку
          const firstLetter = item.charAt(0).toUpperCase();
          const newDir = path.join(destDir, firstLetter);

          fs.mkdir(newDir, { recursive: true }, (err) => {
            if (err) throw err;

            const destFilePath = path.join(newDir, item);

            fs.rename(currentItemPath, destFilePath, (err) => {
              if (err) throw err;
              console.log(`Moved file: ${item} to ${newDir}`);

              if (!--pending) callback();
            });
          });
        }
      });
    });
  });
}

// Получаем параметры командной строки
const args = process.argv.slice(2);
const srcDir = args[0];
const destDir = args[1];
const deleteSrc = args[2] === 'true';

// Проверяем, что параметры заданы
if (!srcDir || !destDir) {
  console.error('Usage: node organizeFiles.js <srcDir> <destDir> [deleteSrc]');
  process.exit(1);
}

// Запускаем процесс организации файлов
organizeFiles(srcDir, destDir, deleteSrc);