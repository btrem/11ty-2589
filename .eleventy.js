const image = require("@11ty/eleventy-img");
const path = require('path')

async function pictureShortcode(pictureData) {

    let src = pictureData.src;
    let rawImage = `raw_images/${src}`;

    metadata = await image(rawImage, {
        widths: [ 500, 900 ],
        formats: [ 'webp', null ],
        outputDir: '_site/images/',
        urlPath: '/images/',
        filenameFormat: function (id, src, width, format, options) {
            const extension = path.extname(src)
            const name = path.basename(src, extension)
            return `${name}-${width}w.${format}`
        }
    });

    let lowsrc = metadata.jpeg[0];

    return `<picture>
        ${Object.values(metadata).map(imageFormat => {
        return `<source srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="90vw" type="${imageFormat[0].sourceType}">`;
        }).join("\n\t")}
    <img src="${lowsrc.url}"
        alt="" loading="lazy" decoding="async">
</picture>`;

}


module.exports = function (eleventyConfig) {

    eleventyConfig.addNunjucksAsyncShortcode("picture", pictureShortcode);

    return {
        markdownTemplateEngine: "njk",

        dir: {
            input: "src"
        }
    };

};
