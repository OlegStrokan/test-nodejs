const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

let fileData: { name: string, description: string }[] = [];


const encodedParams = new URLSearchParams();

const result = {
  data: []
};

const render = fs.createReadStream('myData.csv').pipe(csv());
render.on('data', (data) => {
  fileData.push(data);
})

render.on('end', () => {
  fileData.map((item) => {
    encodedParams.append('text', item.description);
    axios.post('https://twinword-sentiment-analysis.p.rapidapi.com/analyze/',
      encodedParams, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'X-RapidAPI-Host': 'twinword-sentiment-analysis.p.rapidapi.com',
          'X-RapidAPI-Key': '969110b9efmsh64b06630123ff32p196bc1jsna78a31a3a20c',
        }
      }).then((response) => {

        for (let i = 0; i < fileData.length; i++) {
          if (i !== fileData.length - 1) {
            continue;
          }
          result.data.push({ response: response.data, name: item.name});
          fs.truncate('responseData.json', 0, () => {})
          fs.writeFile('responseData.json', JSON.stringify(result ), (err) => {
            if (err) throw err;
          })
        }

      encodedParams.delete('text');
    }).catch(function (error) {
      console.error(error);
    });
  })
  fs.readFile('responseData.json', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    data = JSON.parse(data);

    data = data.data.sort((first, last) => first.response.ratio - last.response.ratio)
    console.log(' --------------------')
    console.log('| From worst to best: |')
    console.log(' --------------------')
    const frequentlyWords = [];
    data.map(item => {
      frequentlyWords.push(...item.response.keywords);
      console.log({ name: item.name, value: item.response.ratio })
    })
    console.log(' --------------------')
    console.log('| Most popular words:|')
    console.log(' --------------------')
    console.table(frequentlyWords.sort((first, last) => first.score - last.score).slice(-10).reverse());
  })
})
