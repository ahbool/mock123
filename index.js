#!/usr/bin/env node

const mockServer = require('./mock-server')
const pkg = require('./package.json')

let args = process.argv.splice(2);

let command = args[0]
let port = parseInt(args[1], 10) || undefined

switch(command){
    case 'start':
        mockServer(port)
        break

    case '-v':
        console.log(pkg.version)
        break

    default:
        console.log('')
        console.log('提示：')
        console.log('    请在mock数据所在文件夹下运行命令 [mock123 start] 来启动服务')
        console.log('    更多使用方法请运行此命令来查看 [npm home mock123]')
        break
}
