// Глобальные переменные:                            
var FIELD_SIZE_X = 20;//столбцы
var FIELD_SIZE_Y = 20;//строки
var BAR_SPEED = 300; // Интервал между перемещениями барьеров
var move_timer; // Таймер движения барьеров
var bar_timer; // Таймер создания барьеров
var ship;   // наш космический корабль
var score = 0;  // Результат
var scoreElement = document.querySelector("#info h3");

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
    document.getElementById('start').addEventListener('click', startGame);
    document.getElementById('renew').addEventListener('click', refreshGame);

// Отслеживание клавиш клавиатуры
    addEventListener('keydown', moveShip);
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

    document.getElementById('war-field').appendChild(game_table); // Добавление таблицы
}

/**
 * Старт игры
 */
function startGame() {
    respawn();//создали корабль

    move_timer = setInterval(moveBars, BAR_SPEED);//каждые 300мс moveBars
    bar_timer = setInterval(createBar, 3000); //каждые 3с генерируется новый барьер
}

/**
 * Создание препятствия (барьера)
 */
function createBar() {
    
        // рандом
        var bar_x = Math.floor(Math.random() * FIELD_SIZE_X);
        var bar_y = 0;

        var bar_cell = document.getElementsByClassName('cell-' + bar_y + '-' + bar_x)[0];
        bar_cell.setAttribute('class', bar_cell.getAttribute('class') + ' bar-unit');
        
}

// функция движения препятствий
function moveBars(){
    // Берём все барьеры и двигаем их 
    var bars = document.getElementsByClassName('bar-unit');
    for (var i=0; i<bars.length;i++){    
        var bar_classes = bars[i].getAttribute('class').split(' ');
        bar_classes.splice(2, 1);     // удаляем класс барьера
        var classes = bar_classes[0] + ' ' + bar_classes[1];
        // теперь в classes обычные классы ячейки таблицы
        bars[i].setAttribute('class', classes);
        
        // создаём барьер в следующей ячейке
        var coord_y = bar_classes[1].split("-")[1];
        if (coord_y < FIELD_SIZE_Y-1){
            coord_y++;
            var coord_x = bar_classes[1].split("-")[2];
            var next_bar = document.getElementsByClassName('cell-' + (coord_y) + '-' + (coord_x))[0];
            // Проверка на корабль
            if (next_bar.getAttribute('class').includes('ship-unit')){
                finishTheGame();
            }
            else{
                next_bar.setAttribute('class', next_bar.getAttribute('class') + ' bar-unit');
            }
        }
        else{
            score++;
            scoreElement.innerText = "Ваш результат: " + score;
        }
    }
}

// функция создания корабля
function respawn() {
    var start_coord_x = Math.floor(FIELD_SIZE_X / 2);
    var start_coord_y = FIELD_SIZE_Y - 1;
    ship = document.getElementsByClassName('cell-' + (start_coord_y) + '-' + start_coord_x)[0];
    ship.setAttribute('class', ship.getAttribute('class') + ' ship-unit');
}

// функция передвижения корабля
function moveShip(event){
    switch (event.keyCode) {
        case 37: // Клавиша влево
            var ship_classes = ship.getAttribute('class').split(' ');
            var coord_x = ship_classes[1].split("-")[2];
            // проверка выхода за левую границу
            if (coord_x != 0){
                var coord_y = ship_classes[1].split("-")[1];
                ship_classes.splice(2, 1);
                var classes = ship_classes[0] + ' ' + ship_classes[1];
                // теперь в classes обычные классы ячейки таблицыr
                ship.setAttribute('class', classes);

                coord_x--;
                ship = document.getElementsByClassName('cell-' + coord_y + '-' + coord_x)[0];
                //проверка на столкновение с барьером
                if (!isBar(ship)){
                    ship.setAttribute('class', ship.getAttribute('class') + ' ship-unit');
                }
                else {
                    finishTheGame();
                }
            }
            break;
        case 39: // Клавиша вправо
            var ship_classes = ship.getAttribute('class').split(' ');
            var coord_x = ship_classes[1].split("-")[2];
            // проверка выхода за правую границу
            if (coord_x != FIELD_SIZE_X - 1){
                var coord_y = ship_classes[1].split("-")[1];
                ship_classes.splice(2, 1);
                var classes = ship_classes[0] + ' ' + ship_classes[1];
                // теперь в classes обычные классы ячейки таблицы
                ship.setAttribute('class', classes);

                coord_x++;
                ship = document.getElementsByClassName('cell-' + coord_y + '-' + coord_x)[0];
                //проверка на столкновение с барьером
                if (!isBar(ship)){
                    ship.setAttribute('class', ship.getAttribute('class') + ' ship-unit');
                }
                else {
                    finishTheGame();
                }
            }
            break;
    }
}

// функция для проверки столкновения с барьером при перемещении корабля
function isBar(ship){
    if (ship.getAttribute('class').includes('bar-unit')){
        return true;
    }
    else{
        return false;
    }
}
/**
 * Функция завершения игры
 */
function finishTheGame() {
    clearInterval(move_timer);
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