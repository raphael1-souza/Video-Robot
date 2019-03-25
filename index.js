const readline = require ('readline-sync')
const googleTrends = require('google-trends-api');

async function start(){
    const content = {}
    content.searchTerm = askAndReturnSearchTerm()
    // content.test= test(content.searchTerm)
    content.prefix = askAndReturnPrefix(content.searchTerm)
    console.log(content);
    function askAndReturnSearchTerm(){
       const response = readline.question('Type a Wikepedia search term: ')
       return response

    }
    function askAndReturnPrefix(){
        const prefixes = ['Who is', 'What is', 'The history of']
        const selectedPrefixIndex = readline.keyInSelect(prefixes,'Choose one option: ')
        const selectedPrefixText = prefixes[selectedPrefixIndex]
        return selectedPrefixText
    }


/////////////////Projeto futuro
    // function test(palavra){
    //     googleTrends.relatedQueries({keyword: palavra})
    //     .then((res) => {
    //      obj = JSON.parse(res);
    //      resJson = JSON.parse(JSON.stringify(obj.default.rankedList[0]))
    //      var count = Object.keys(obj.default.rankedList[0].rankedKeyword).length; // contador de quantos itens há no objeto
    //      vetorRelacional = new Array(count);
    //      for(i=0;i<9;i++){
    //         vetorRelacional[i] =resJson.rankedKeyword[i].query
 
    //      }
    //      const selectedPrefixIndex = readline.keyInSelect(vetorRelacional,'Choose one option: ')
    //     //  const v = vetorRelacional[0]
    //     //  return v;
         
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     })
    //     }
}




start()