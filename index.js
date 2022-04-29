var fs = require('fs');
var csv = require('csv-parser');
var axios = require('axios');
var fileData = [];
var encodedParams = new URLSearchParams();
var result = {
    data: []
};
var render = fs.createReadStream('myData.csv').pipe(csv());
render.on('data', function (data) {
    fileData.push(data);
});
render.on('end', function () {
    fileData.map(function (item) {
        encodedParams.append('text', item.description);
        axios.post('https://twinword-sentiment-analysis.p.rapidapi.com/analyze/', encodedParams, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Host': 'twinword-sentiment-analysis.p.rapidapi.com',
                'X-RapidAPI-Key': '969110b9efmsh64b06630123ff32p196bc1jsna78a31a3a20c'
            }
        }).then(function (response) {
            for (var i = 0; i < fileData.length; i++) {
                if (i !== fileData.length - 1) {
                    continue;
                }
                result.data.push({ response: response.data, name: item.name });
                fs.truncate('responseData.json', 0, function () { });
                fs.writeFile('responseData.json', JSON.stringify(result), function (err) {
                    if (err)
                        throw err;
                });
            }
            encodedParams["delete"]('text');
        })["catch"](function (error) {
            console.error(error);
        });
    });
    fs.readFile('responseData.json', 'utf-8', function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        data = JSON.parse(data);
        data = data.data.sort(function (first, last) { return first.response.ratio - last.response.ratio; });
        console.log(' --------------------');
        console.log('| From worst to best: |');
        console.log(' --------------------');
        var frequentlyWords = [];
        data.map(function (item) {
            frequentlyWords.push.apply(frequentlyWords, item.response.keywords);
            console.log({ name: item.name, value: item.response.ratio });
        });
        console.log(' --------------------');
        console.log('| Most popular words:|');
        console.log(' --------------------');
        console.table(frequentlyWords.sort(function (first, last) { return first.score - last.score; }).slice(-10).reverse());
    });
});
