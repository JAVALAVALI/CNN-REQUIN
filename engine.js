var modelo = null;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
const resultElement = document.getElementById('result');
var clases = ["RAM", "MOTHERBOARD", "HDD", "SSD", "CPU", "GPU", "FUENTE DE ALIMENTACIÓN", "MOUSE", "TECLADO", "PANTALLA"];

(async () => {
    console.log("Cargando modelo...");
    model = await tf.loadLayersModel('./modelo/finalModel.json')
    console.log('Modelo cargado');
    document.getElementById('imageUpload').disabled = false
    drawImageOnCanvas('/iam.png', 'canvas')
})();


async function classifyImage(imageData) {
    // Preprocesa la imagen según tu modelo
    const tensor = tf.browser.fromPixels(imageData)
        .resizeNearestNeighbor([150, 150])  // Ajusta el tamaño a 150x150 píxeles
        .toFloat()
        .expandDims();

    // Haz la predicción
    const prediction = await model.predict(tensor).data();
    const predictedClass = prediction.indexOf(Math.max(...prediction));

    // Muestra el resultado
    resultElement.textContent = `${clases[predictedClass]}, ${(prediction[predictedClass] * 100).toFixed(2)}%`;
}

document.getElementById('imageUpload').addEventListener('change', (event) => {
    resultElement.textContent = 'Haciendo la predicción...'
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.getElementById('canvas');
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height)
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            classifyImage(canvas);
        }
        img.src = e.target.result;
    }
    reader.readAsDataURL(file);
});

function drawImageOnCanvas(imageUrl, canvasId) {
    const canvas = document.getElementById(canvasId);
    const context = canvas.getContext('2d');

    const image = new Image();
    image.onload = function () {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };

    image.src = imageUrl;
}

