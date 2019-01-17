var goodsForBuy = [];   // Массив товаров в корзине
var table = document.getElementById('tableToBuy');

function addToCart(number) {
    // Проверяем, есть ли новый товар в корзине,
    // и если нет - добавляем
    if (goodsForBuy.indexOf(goods[number]) == -1) {
        goods[number].score = 1;    //кол-во единиц товара
        goods[number].priceAll = goods[number].price;   // общая стоимость
        goodsForBuy.push(goods[number]);
    }
    // Если же товар уже есть, просто увеличиваем его кол-во
    else {
        goods[number].score++;
        goods[number].priceAll += goods[number].price;
    }
    showCart();
}

function showCart() {
    // Строим таблицу с товарами в корзине
    table.innerHTML = "";
    var row, col0, col1, col2;
    for (var i = 0; i < goodsForBuy.length; i++) {
        row = table.insertRow(i);
        col0 = row.insertCell(0);
        col0.innerText = goodsForBuy[i].name;
        col1 = row.insertCell(1);
        col1.innerText = goodsForBuy[i].score + " шт. ";
        col2 = row.insertCell(2);
        col2.innerText = goodsForBuy[i].priceAll + " руб.";
    }
    cartSum();
}

function cartSum() {
    var sumItem, summ = 0;
    for (var i = 0; i < goodsForBuy.length; i++) {
        summ += goodsForBuy[i].priceAll;   // суммируем цены в корзине
    }
    sumItem = document.getElementById("summ");
    document.getElementById("summ").innerHTML = "";
    sumItem.innerHTML = "<b>Итог: " + summ + " руб.</b>";
}