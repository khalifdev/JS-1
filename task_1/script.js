function init() {
    var images = document.getElementsByTagName("img");
    for (var i = 0; i < images.length; i++) {
        images[i].onclick = changeBigPicture;
    }
}

function changeBigPicture(eventObj) {
    var appDiv = document.getElementById("big_picture");
    appDiv.innerHTML = "";
    var eventElement = eventObj.target;
    var imageNameParts = eventElement.id.split("_");
    var src = "big/" + imageNameParts[1] + ".jpg";
    var alt = "Увеличенная картинка";
    var imageDomElement = document.createElement("img");
    imageDomElement.src = src;
    imageDomElement.alt = alt;
    imageDomElement.onerror = myError;  // Проверка наличия картинки
    appDiv.appendChild(imageDomElement);
}
function myError() {
    alert("Не загрузилась картинка: " + this.src);
}
window.onload = init;