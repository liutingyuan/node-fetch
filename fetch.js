const http = require('http');
const https = require('https');
const URI = require('url');

function fetch(url, params) {
    return new Promise((resolve, reject) => {
        const options = Object.assign({}, URI.parse(url), params);
        const client = require(options.protocol.slice(0, -1));

        const req = client.request(options, res => {
            let buffer = [];
            res.on('data', (chunck) => buffer.push(chunck));
            res.on('end', () => {
                res.data = Buffer.concat(buffer);
                res.text = () => Promise.resolve(res.data.toString());
                res.json = () => res.text().then(JSON.parse);
                resolve(res);
            });
        })

        req.end();
    });
}

fetch('http://www.baidu.com')
.then(res => res.json())
.then(res => console.log(res, typeof res));