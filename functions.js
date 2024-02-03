const { createCanvas, loadImage } = require("canvas")

module.exports = {
    transparentImage: async function ({ url, percentage }) {
        var background = await loadImage(url);

        const canvas = createCanvas(background.width, background.height)
        const ctx = canvas.getContext('2d')

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        var image = ctx.getImageData(0, 0, 512, 512);

        var imageData = image.data,
            length = imageData.length;

        for (var i = 3; i < length; i += 4) {
            imageData[i] = (percentage * 250) / 100;
        }

        image.data = imageData;

        ctx.putImageData(image, 0, 0);

        return await loadImage(canvas.toBuffer())
    },

    circleImage: async function ({ image, stroke, fill, weight }) {
        try {
            stroke = stroke ? 'BLACK' : null;
            fill = fill ? fill : null;
            weight = stroke ? 40 : 0

            var canvas = new createCanvas(1024, 1024),
                ctx = canvas.getContext("2d");
            var x, y, w, h;
            x = y = weight;
            w = canvas.width - weight * 2;
            h = canvas.height - weight * 2;
            ctx.lineWidth = weight;
            ctx.strokeStyle = stroke;
            ctx.fillStyle = fill;
            ctx.beginPath();
            ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2, true);
            if (stroke) ctx.stroke();
            if (fill) ctx.fill();
            ctx.clip();

            if (image) ctx.drawImage(image, x, y, w, h);

            return loadImage(canvas.toBuffer());
        } catch (e) {
            return error(`drawCircle:\n ${e}`);
        }
    },

    createColor: function({ color, width, height }) {
        const canvas = createCanvas(width, height)
        const ctx = canvas.getContext('2d')

        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        return canvas.toBuffer();
    }
}