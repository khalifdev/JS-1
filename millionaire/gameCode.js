// answer - ответ пользователя (буква), ok - для проверки валидности ответа,
// summ - выигрыш, unfire - для несгораемых сумм
var answer, ok, summ = 0, unfire = 0;

// Функция для вывода вопроса и проверки правильности ответа
function question(lvlX){
    do {//Выводим вопрос
        ok = false;
        answer = prompt(lvlX.q + lvlX.a + lvlX.b + lvlX.c + lvlX.d, "-1 - забрать деньги (выход)");
        // Забрать деньги
        if (answer == -1) {
            break;
        }
        else {
            ok = isAnswer(answer);  // isAnswer проверяет валидность ответа
        }
    } while (!ok);
    // Обработка ответа:
    if (answer == -1){
        alert("Правильный ответ: " + lvlX.right + ".\n" + lvlX.a + lvlX.b + lvlX.c + lvlX.d);
        return -1;
    }
    else if (answer == lvlX.right){
        if (lvlX.coast == 1000){
            unfire = lvlX.coast;
            summ = lvlX.coast;
            alert("У Вас несгораемая сумма: " + summ + " рублей!");
        }
        else {
            summ = lvlX.coast;
            alert("Правильно! Вы заработали " + summ + " рублей.");
        }
        return 1;
    }
    else {        
        alert("Правильный ответ: " + lvlX.right + ".\n" + lvlX.a + lvlX.b + lvlX.c + lvlX.d);
        summ = 0;
        if (unfire != 0){
            summ = unfire;
        }
        return 0;
    }
}

// Функция для проверки валидности ответа пользователя
function isAnswer(answer) {
    if ((answer!='a') && (answer!='b') && (answer!='c') && (answer!='d')) {
        alert('Вы ввели недопустимый символ');
        return false;
    }
    else return 1;
    
}

// good - результат ответа на вопрос (возвращает question(lvlX)),
// questionArr[] - массив вопросов
var good, 
    questionArr = [
        lvl100[0],
        lvl200[0],
        lvl300[0],
        lvl500[0],
        lvl1000[0],
        lvl2000[0],
        lvl5000[0]
    ];

//Последовательно задаём вопросы
for(var i in questionArr){
    good = question(questionArr[i]);
    if (good == -1 || good == 0){   // игра заканчивается, если забираем деньги
        break;                      // или ответ неправильный
    }
}
alert("Ваш выигрыш: " + summ + " рублей!\nСпасибо за игру!");