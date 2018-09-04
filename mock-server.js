const fs = require('fs')
const url = require('url')
const path = require('path')
const http = require('http')
const querystring = require('querystring')

const DEFAULT_PORT = 7777

function handleResponseData(req, res, getData, postData){

    let cwd = process.cwd()
    let pathName = url.parse(req.url).pathname
    let fileName = pathName.substr(pathName.lastIndexOf('/') + 1)
    let localFile = path.join(cwd, fileName)

    let jsFile = localFile + '.js'
    let jsonFile = localFile + '.json'

    if(fs.existsSync(jsFile)){
        delete require.cache[jsFile]
        let jsFileModule = require(jsFile)
        let data = jsFileModule(getData, postData)

        httpResponse({
            response: res,
            httpState: 200,
            httpMsg: JSON.stringify(data)
        })
        return
    }

    fs.readFile(jsonFile, 'utf8', (err, data) => {
        if(err) {
            httpResponse({
                response: res,
                httpState: 404
            })
        } else {
            httpResponse({
                response: res,
                httpState: 200,
                httpMsg: data.toString()
            })
        }
    })
}

function httpResponse({response, httpState, httpMsg}){
    if(httpState === 404){
        response.writeHead(404)
        response.write('404 Not Found')
    } else {
        response.writeHead(httpState, {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'x-requested-with',
            'Access-Control-Allow-Credentials': 'true'
        })
        response.write(httpMsg)
    }

    response.end()
}


module.exports = (port) => {
    port = port || DEFAULT_PORT

    http.createServer((req, res) => {
        let getData = ''
        let postData = ''

        getData = querystring.parse(url.parse(req.url).query)

        req.on('data', chunk => postData += chunk)

        req.on('end', () => {
            postData = querystring.parse(postData)
            handleResponseData(req, res, getData, postData)
        })
    }).listen(port, () => {
        console.log(`Mock Server running at http://localhost:${port}`)
    })
}