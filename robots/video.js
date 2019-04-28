const gm = require('gm').subClass({imageMagick:true})
const state = require('./state')

async function robot(){
    const content = state.load()
    await convertAllImages(content);
    await createAllSentenceImages(content)
    await createYoutubeThumbnail()
    state.save(content)
    async function convertAllImages(content){
        for ( let sentenceIndex= 0; sentenceIndex<content.sentences.length;sentenceIndex++){
            await convertImage(sentenceIndex)
        }
    }

    async function convertImage(sentenceIndex){
        return new Promise((resolve,reject)=>{
            const inputFile = path.resolve(__dirname, '..', 'content', `${sentenceIndex}-original.png[0]`)
            const outputFile = path.resolve(__dirname, '..', 'content', `${sentenceIndex}-converted.png`)
            const width = 1920
            const height = 1080

            gm()
                .in(inputFile)
                .out('(')
                    .out('-clone')
                    .out('0')
                    .out('-background', 'white')
                    .out('-blur', '0x9')
                    .out('-resize', `${width}x${height}^`)
                .out(')')
                .out('(')
                    .out('-clone')
                    .out('0')
                    .out('-background', 'white')
                    .out('-resize', `${width}x${height}`)
                .out(')')
                .out('-delete', '0')
                .out('-gravity', 'center')
                .out('-compose', 'over')
                .out('-composite')
                .out('-extent', `${width}x${height}`)
                .write(outputFile, (error) => {
                if (error) {
                    return reject(error)
                }

                console.log(`> Image converted: ${inputFile}`)
                resolve()
                })
        })
    }
     async function createAllSentenceImages(content){
         for(let sentenceIndex=0; sentenceIndex < content.sentences.length; sentenceIndex++){
             await createSentenceImage(sentenceIndex,content.sentences[sentenceIndex].text)
         }
     }
     async function createSentenceImage(sentenceIndex,sentenceText){
         return new Promise((resolve,reject)=>{
            const outputFile = path.resolve(__dirname, '..', 'content', `${sentenceIndex}-sentence.png`)
            const templateSettings = {
                0: {
                  size: '1920x400',
                  gravity: 'center'
                },
                1: {
                  size: '1920x1080',
                  gravity: 'center'
                },
                2: {
                  size: '800x1080',
                  gravity: 'west'
                },
                3: {
                  size: '1920x400',
                  gravity: 'center'
                },
                4: {
                  size: '1920x1080',
                  gravity: 'center'
                },
                5: {
                  size: '800x1080',
                  gravity: 'west'
                },
                6: {
                  size: '1920x400',
                  gravity: 'center'
                }
        
              }
        
              gm()
                .out('-size', templateSettings[sentenceIndex].size)
                .out('-gravity', templateSettings[sentenceIndex].gravity)
                .out('-background', 'transparent')
                .out('-fill', 'white')
                .out('-kerning', '-1')
                .out(`caption:${sentenceText}`)
                .write(outputFile, (error) => {
                  if (error) {
                    return reject(error)
                  }
        
                  console.log(`> Sentence created: ${outputFile}`)
                  resolve()
                })
            })
     }

    async function createYoutubeThumbnail(){
        const inputFile = path.resolve(__dirname, '..', 'content', `6-original.png[0]`)
        const outputFile = path.resolve(__dirname, '..', 'content', `youtube-thumbnail.jpg`)
        return new Promise((resolve,reject)=>{
            gm()
                .in(inputFile)
                .write(outputFile,(error)=>{
                    if(error){
                        return reject(error)
                    }
                    console.log('> Creating Youtube Thumbnail')
                    resolve()
                })
        })
    }
}
module.exports = robot