# nodejs-organize-files

`node organizeFiles ./source ./organized true` - этот скрипт рекурсивно пройдет по всем уровням вложенности в `./source`, переместит все файлы в соответствующие подпапки в `./organized` и удалит `./source`, если передан флаг `true`.

`node server PORT=3000 INTERVAL=1000 DURATION=5000` - этот скрипт запускает сервер на 3000 порту (`PORT`), при получении GET запроса запускается таймер, который выводит текущую дату и время в консоль 5 секунд (`DURATION`) через каждую секунду (`INTERVAL`).

`curl http://localhost:3000/` - тестирование сервера

`curl "http://localhost:3000/organize?src=./source&dest=./organized&delete=true"` - использование сервера, для сортировки файлов из папки `./source` в папку `./organized` с последующим удалением папки `./source`, если параметр `delete=true`