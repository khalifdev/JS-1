// Глобальные переменные:                            
var FIELD_SIZE_X = 20;//столбцы
var FIELD_SIZE_Y = 20;//строки
var SNAKE_SPEED = 100; // Интервал между перемещениями змейки
var snake = []; // Сама змейка
var direction = 'y-'; // Направление движения змейки
var snake_timer; // Таймер змейки
var bar_timer; // Таймер для еды
var bar_mas = [];   // массив для хранения барьеров
var bar_limit = 5;  // лимит барьеров (препятствий)
var score = 0; // Результат
var scoreElement; // Элемент для отображения результата

function init() {
    scoreElement = document.querySelector("#info h3");
    prepareGameField(); // Генерация поля

    var wrap = document.getElementsByClassName('wrap')[0];
    // Подгоняем размер контейнера под игровое поле
    
	/*
	if (16 * (FIELD_SIZE_X + 1) < 380) {
        wrap.style.width = '380px';
    }
    else {
        wrap.style.width = (16 * (FIELD_SIZE_X + 1)).toString() + 'px';
    }
    */
    wrap.style.width = '400px';
    // События кнопок Старт и Новая игра
    document.getElementById('snake-start').addEventListener('click', startGame);
    document.getElementById('snake-renew').addEventListener('click', refreshGame);

// Отслеживание клавиш клавиатуры
    addEventListener('keydown', changeDirection);
}

/**
 * Функция генерации игрового поля
 */
function prepareGameField() {
    // Создаём таблицу
    var game_table = document.createElement('table');
    game_table.setAttribute('class', 'game-table ');

    // Генерация ячеек игровой таблицы
    for (var i = 0; i < FIELD_SIZE_Y; i++) {
        // Создание строки
        var row = document.createElement('tr');
        row.className = 'game-table-row row-' + i;

        for (var j = 0; j < FIELD_SIZE_X; j++) {
            // Создание ячейки
            var cell = document.createElement('td');
            cell.className = 'game-table-cell cell-' + i + '-' + j;

            row.appendChild(cell); // Добавление ячейки
        }
        game_table.appendChild(row); // Добавление строки
    }

    document.getElementById('snake-field').appendChild(game_table); // Добавление таблицы
}

/**
 * Старт игры
 */
function startGame() {
    respawn();//создали змейку

    snake_timer = setInterval(move, SNAKE_SPEED);//каждые 100мс запускаем функцию move
    setTimeout(createFood, 1000);
    bar_timer = setInterval(barDel, 6000); //каждые 6с удаляется барьер, и генерируется новый
}

/**
 * Функция расположения змейки на игровом поле
 */
function respawn() {
    // Змейка - массив td
    // Стартовая длина змейки = 2

    // Respawn змейки из центра
    var start_coord_x = Math.floor(FIELD_SIZE_X / 2);
    var start_coord_y = Math.floor(FIELD_SIZE_Y / 2);

    // Голова змейки
    var snake_head = document.getElementsByClassName('cell-' + (start_coord_y-1) + '-' + start_coord_x)[0];
    snake_head.setAttribute('class', snake_head.getAttribute('class') + ' snake-unit');
    // Тело змейки
    var snake_tail = document.getElementsByClassName('cell-' + start_coord_y + '-' + start_coord_x)[0];
    snake_tail.setAttribute('class', snake_tail.getAttribute('class') + ' snake-unit');

    snake.push(snake_tail);
    snake.push(snake_head);
}

/**
 * Движение змейки
 */
function move() {
    // Сборка классов
    var snake_head_classes = snake[snake.length-1].getAttribute('class').split(' ');

    // Сдвиг головы
    var new_unit;
    var snake_coords = snake_head_classes[1].split('-');//преобразовали строку в массив
    var coord_y = parseInt(snake_coords[1]);
    var coord_x = parseInt(snake_coords[2]);

    // Определяем новую точку
    if (direction == 'x-') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y) + '-' + (coord_x - 1))[0];
        // если вышли за границу
        if (new_unit == undefined){
            new_unit = document.getElementsByClassName('cell-' + (coord_y) + '-' + (FIELD_SIZE_X - 1))[0];
        }
    }
    else if (direction == 'x+') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y) + '-' + (coord_x + 1))[0];
        // если вышли за границу
        if (new_unit == undefined){
            new_unit = document.getElementsByClassName('cell-' + (coord_y) + '-0')[0];
        }
    }
    else if (direction == 'y-') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y - 1) + '-' + (coord_x))[0];
        // если вышли за границу
        if (new_unit == undefined){
            new_unit = document.getElementsByClassName('cell-' + (FIELD_SIZE_Y - 1) + '-' + (coord_x))[0];
        }
    }
    else if (direction == 'y+') {
        new_unit = document.getElementsByClassName('cell-' + (coord_y + 1) + '-' + (coord_x))[0];
        // если вышли за границу
        if (new_unit == undefined){
            new_unit = document.getElementsByClassName('cell-0-' + (coord_x))[0];
        }
    }

    // Проверки
    // 1) new_unit не часть змейки
    // 2) Змейка не врезалась в барьер
    //console.log(new_unit);
    if (!isSnakeUnit(new_unit) && !new_unit.getAttribute('class').includes('bar-unit')) {
        // Добавление новой части змейки
        new_unit.setAttribute('class', new_unit.getAttribute('class') + ' snake-unit');
        snake.push(new_unit);

        // Проверяем, надо ли убрать хвост
       
	   if (!haveFood(new_unit)) {
            // Находим хвост
            var removed = snake.splice(0, 1)[0];
            var classes = removed.getAttribute('class').split(' ');
			
            // удаляем хвост
            removed.setAttribute('class', classes[0] + ' ' + classes[1]);
        }
    }
    else {
        finishTheGame();
    }
}

/**
 * Проверка на змейку
 * @param unit
 * @returns {boolean}
 */
function isSnakeUnit(unit){//проверка, что змейка не попала сама в себя в новой ячейке
    var check = false;

    if (snake.includes(unit)) {//если в змейке содержится новая ячейка, значит возникло пересечение
        check = true;
    }
    return check;
}
/**
 * проверка на еду
 * @param unit
 * @returns {boolean}
 */
function haveFood(unit) {
    var check = false;

    var unit_classes = unit.getAttribute('class').split(' ');

    // Если еда
    if (unit_classes.includes('food-unit')) {
        check = true;
        createFood();
        score++;
        scoreElement.innerText = "Ваш результат: " + score;
    }
    return check;
}

/**
 * Создание еды
 */
function createFood() {
    var foodCreated = false;

    while (!foodCreated) { //пока еду не создали
        // рандом
        var food_x = Math.floor(Math.random() * FIELD_SIZE_X);
        var food_y = Math.floor(Math.random() * FIELD_SIZE_Y);

        var food_cell = document.getElementsByClassName('cell-' + food_y + '-' + food_x)[0];
        var food_cell_classes = food_cell.getAttribute('class').split(' ');

        // проверка на змейку и барьер
        if (!food_cell_classes.includes('snake-unit') && !food_cell_classes.includes('bar-unit')) {
            var classes = '';
            for (var i = 0; i < food_cell_classes.length; i++) {
                classes += food_cell_classes[i] + ' ';
            }

            food_cell.setAttribute('class', classes + 'food-unit');
            foodCreated = true;
        }
    }
}

/**
 * Создание препятствия (барьера)
 */
function createBar() {
    
        // рандом
        var bar_x = Math.floor(Math.random() * FIELD_SIZE_X);
        var bar_y = Math.floor(Math.random() * FIELD_SIZE_Y);

        var bar_cell = document.getElementsByClassName('cell-' + bar_y + '-' + bar_x)[0];
        var bar_cell_classes = bar_cell.getAttribute('class').split(' ');

        // проверка на змейку и еду
        if (!bar_cell_classes.includes('snake-unit') && !bar_cell_classes.includes('food-unit')) {
            var classes = '';
            for (var i = 0; i < bar_cell_classes.length; i++) {
                classes += bar_cell_classes[i] + ' ';
            }

            bar_cell.setAttribute('class', classes + 'bar-unit');
            bar_mas.push(bar_cell);
        }
}

function barDel(){
    // Удаление одного из барьеров наугад
    if (bar_mas.length == bar_limit){
        // random
        var indexForDel = Math.floor(Math.random() * bar_limit);
        
        var bar_exist = document.getElementsByClassName('bar-unit')[indexForDel];
        var bar_exist_classes = bar_exist.getAttribute('class').split(' ');
        var classes = '';
        // length-1 - значит без последнего класса ('bar-unit')
        for (var i = 0; i < bar_exist_classes.length-1; i++) {
            classes += bar_exist_classes[i] + ' ';
        }
        // теперь в classes обычные классы ячейки таблицы
        bar_exist.setAttribute('class', classes);
        bar_mas.splice(indexForDel, 1);     // удаляем барьер из массива
    }
    createBar();    // и сразу же генерируем новый барьер
}
/**
 * Изменение направления движения змейки
 * @param e - событие
 */
function changeDirection(e) {
    //console.log(e);
	switch (e.keyCode) {
        case 37: // Клавиша влево
            if (direction != 'x+') {
                direction = 'x-'
            }
            break;
        case 38: // Клавиша вверх
            if (direction != 'y+') {
                direction = 'y-'
            }
            break;
        case 39: // Клавиша вправо
            if (direction != 'x-') {
                direction = 'x+'
            }
            break;
        case 40: // Клавиша вниз
            if (direction != 'y-') {
                direction = 'y+'
            }
            break;
    }
}

/**
 * Функция завершения игры
 */
function finishTheGame() {
    clearInterval(snake_timer);
    clearInterval(bar_timer);
    alert('Вы проиграли! Ваш результат: ' + score.toString());
    refreshGame();
}

/**
 * Новая игра
 */
function refreshGame() {
    location.reload();
}

// Инициализация
window.onload = init;