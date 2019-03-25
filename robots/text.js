const algorithmia = require('algorithmia')
const algorithmiaApiKey = require ('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')


async function robot (content) {
    await fetchContentFromWikipedia(content)
    sanitizeContent(content)
    breakContentIntoSentences(content)
    async function fetchContentFromWikipedia(content){
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey)
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo("web/WikipediaParser/0.1.2?timeout=300")
        const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm)
        const wikipediaContent = wikipediaResponse.get()
        content.sourceContentOriginal = wikipediaContent.content
    }
    function sanitizeContent(content) {
        const withoutBlankLines = removeBlankLines(content.sourceContentOriginal)
        const withoutMarkdown = removeMarkdown(withoutBlankLines)
        const withoutDatesInParentheses = removeDatesInParentheses(withoutMarkdown)
        content.sourceContentSanitized = withoutDatesInParentheses

        function removeBlankLines (text) {
            const allLines = text.split('\n')
            const withoutBlankLines = allLines.filter((line)=>{
                if (line.trim().length === 0){
                    return false
                }
                return true
            })
            return withoutBlankLines
        }
    }
    function removeMarkdown(lines) {
        const withoutMarkdown = lines.filter((line)=>{
            if (line.trim().startsWith('=')){
                return false
            }
            return true
        })
        return withoutMarkdown
    }
    function removeDatesInParentheses(text) {
        return text.toString().replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
    }

    function breakContentIntoSentences(content){
        content.sentences = []
        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
        sentences.forEach((sentence)=>{
            content.sentences.push({
                text:sentence,
                keywords:[],
                images:[]
            })
        })
    }
}

module.exports= robot