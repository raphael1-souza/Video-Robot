const algorithmia = require('algorithmia')
const algorithmiaApiKey = require ('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')
const watsonApiKey = require('../credentials/watson-nlu.json').apikey


const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js')

var nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey:watsonApiKey,
  version: '2018-04-05',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});



async function robot (content) {
    await fetchContentFromWikipedia(content)
    sanitizeContent(content)
    breakContentIntoSentences(content)
    limitMaximumSentences(content)
    await fetchKeywordOfAllSentences(content)
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
    
    function limitMaximumSentences(content){
        content.sentences = content.sentences.slice(0,content.maximumSentences)
    }

    async function fetchKeywordOfAllSentences(content){
        for (const sentence of content.sentences){
            sentence.keywords = await fetchWatsonAndReturnKeyword(sentence.text)
            
        }
    }

    async function fetchWatsonAndReturnKeyword (sentence){
        return new Promise((resolve,reject)=> {
            nlu.analyze({
                text:sentence,
                features : {
                    keywords:{}
                }
            },(error,response)=>{
                if(error){
                    throw error
                }
                const keywords = response.keywords.map((keyword)=>{
                    return keyword.text
                })
                resolve(keywords)
            })
        })
    }
}

module.exports= robot