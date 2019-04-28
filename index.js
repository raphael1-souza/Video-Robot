

const robots = {
    text: require('./robots/text.js'),
    input:require('./robots/input.js'),
    state: require ('./robots/state.js'),
    image: require('./robots/image.js'),
    video: require('./robots/video.js')
}
async function start(){

    robots.input()
    await robots.text()
    await robots.image()
    await robots.video()
}




start()