var Jimp = require('jimp');

Jimp.read('place.png', (err, img) => {
    if (err) throw err;
    let output = img.clone();
    output.scale(3);

    output.scan(0, 0, output.bitmap.width, output.bitmap.height, function (x, y, idx) {
        // set alpha to 0
        output.bitmap.data[idx + 3] = 0;
    });

    img.scan(0, 0, output.bitmap.width, output.bitmap.height, function (x, y, idx) {
        var outx = x * 3 + 1, outy = y * 3 + 1;
        var color = img.getPixelColor(x, y);

        output.setPixelColor(color, outx, outy);
    });

    output.write('output.png');
});
