const { createCanvas, loadImage } = require("canvas")
const { markers } = require("./mongo")
const { transparentImage, circleImage, createColor } = require("../utils/functions")
const { AttachmentBuilder } = require("discord.js")

module.exports = {
    delete: async function (interaction) {
        let marker = await markers.findOne({ guildId: interaction.guild.id })

        let channel = interaction.guild.channels.cache.get(marker.channelId)
        let message = await channel.messages.fetch(marker.messageId).catch(err => { })

        if (message) {
            message.delete().catch(err => {})
        }
    },

    createMark: async function(color, stroke=null) {
        stroke = stroke ? stroke : null

        let image = await transparentImage({ url: createColor({ color, width: 100, height: 100 }), percentage: 30 })
        image = await circleImage({ image, stroke })

        return image
    },

    create: async function (markers, numbers) {
        var background = await loadImage('./utils/images/map.png');

        const canvas = createCanvas(512, 512)
        const ctx = canvas.getContext('2d')

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.font = "18px Verdana";

        for(const marker of markers) {
            const circle = await module.exports.createMark(marker.color, marker.stroke)
            ctx.drawImage(circle, marker.x, marker.y, 40, 40);

            if(numbers) {
                let number = markers.indexOf(marker) + 1
                ctx.fillText(number, marker.x + (number.length === 1 ? 19 : 15), marker.y + 30)
            }
        }

        return canvas.toBuffer("image/png");
    },

    update: async function (interaction, guild) {
        let map = await module.exports.create(guild.markers)
        let attachment = new AttachmentBuilder(map, { name: 'map.png' })

        let channel = interaction.guild.channels.cache.get(guild.channelId)
        let message = await channel.messages.fetch(guild.messageId).catch(err => { })

        await message.edit({ files: [attachment] })
    }
}