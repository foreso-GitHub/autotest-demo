//region require
let WebSocket = require('ws');
let log4js = require('log4js')
log4js.configure('./log4js.json')
let logger = log4js.getLogger('default')
let util = require('util')
let baseInterface = require('../base/baseInterface')
let utility = require('../../testUtility')
//endregion


function websocketInterface() {

    //region constructor
    //inherits
    if (!(this instanceof websocketInterface)) {
        return new websocketInterface()
    }
    baseInterface.call(this)
    util.inherits(websocketInterface, baseInterface)

    //set new value for prototype, must after inherits
    baseInterface.prototype.className = "websocketInterface"

    this.close = function(){
        logger.debug('All done!')
    }
    //endregion

    //region common methods
    websocketInterface.prototype.getResponse = function (server, methodName, params) {
        baseInterface.prototype.getResponse(server, methodName, params)
        return new Promise(async (resolve, reject) => {
            let requestContent = JSON.stringify(baseInterface.prototype.createJsonRpcRequestContent(this.id++, methodName, params))
            let data = await websocketInterface.prototype.request(this.url, requestContent)
            if (data != null && JSON.stringify(data.result) !== '{}'){
                logger.debug('---Result: ', data)  //important logger
                if(data.message){
                    logger.debug('---message.result: ', JSON.stringify(data.message.result))
                }
                resolve(data)
            }
            else{
                resolve(baseInterface.prototype.createError(data))
            }
        })
    }


    websocketInterface.prototype.request = function(url, content){
        return new Promise((resolve, reject)=>{
            const ws = new WebSocket(url)

            ws.on('open', function open() {
                // console.log('open')
                ws.send(content);
            })

            ws.on('message', function incoming(data) {
                let result = JSON.parse(data)
                resolve(result)
                ws.close()
            })

            ws.on('close', function close() {
                // console.log('disconnected')
            })
        })

    }

    websocketInterface.prototype.valueToAmount = function (value) {
        return (utility.valueToAmount(value)).toString()
    }

    //endregion

    //region subscribe methods

    websocketInterface.prototype.getSubscribeData = function (server, methodName, params) {
        baseInterface.prototype.getResponse(server, methodName, params)
        return new Promise(async (resolve, reject) => {
            let requestContent = JSON.stringify(baseInterface.prototype.createJsonRpcRequestContent(this.id++, methodName, params))
            const ws = new WebSocket(this.url)
            const stopTime = 15000
            let data = await websocketInterface.prototype.subscribe(ws, requestContent, stopTime)
            if (data != null && JSON.stringify(data.result) !== '{}'){
                logger.debug('---Result: ', data)  //important logger
                if(data.message){
                    logger.debug('---message.result: ', JSON.stringify(data.message.result))
                }
                resolve(data)
            }
            else{
                resolve(baseInterface.prototype.createError(data))
            }
        })
    }


    websocketInterface.prototype.subscribe = function(ws, content, stopTime){
        return new Promise((resolve, reject)=>{

            let output = []

            ws.on('open', function open() {
                ws.send(content)
                if(stopTime > 0){
                    setTimeout(
                        () => {
                            resolve(output)
                            ws.close()
                        }, stopTime)
                }
                else{
                    resolve(output)
                    ws.close()
                }
            })

            ws.on('message', function incoming(data) {
                output.push(JSON.parse(data))
                // logger.debug(data)
            })

            ws.on('close', function close() {
                // logger.debug('disconnected')
            })
        })

    }

    //endregion

}

module.exports = websocketInterface