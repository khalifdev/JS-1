// Инициализация кнопок
var right_btn = document.getElementById("right");
right_btn.onclick = rightF;
var left_btn = document.getElementById("left");
left_btn.onclick = leftF;
// Инициализация картинки
var img = document.querySelector("img");

// Извлекаем номер картинки для дальнейшего изменения
var fileName = img.src.split("/");  // последний элемент в fileName: "1.jpg"
fileName = fileName[fileName.length - 1].split("."); // 0-й элемент: "1"

// Максимальный номер картинки
var max = 5;

// Обработчик нажатия "вправо"
function rightF(){
        if (fileName[0] == max) fileName[0] = 0;
        fileName[0]++;
        img.src = "big/" + fileName[0] + ".jpg";
        img.onerror = rightF;   // Если нет файла, то повторяем
}
// Обработчик нажатия "влево"
function leftF(){
        if (fileName[0] == 1) fileName[0] = max + 1;
        fileName[0]--;
        img.src = "big/" + fileName[0] + ".jpg";
        img.onerror = leftF;    // Если нет файла, то повторяем
}