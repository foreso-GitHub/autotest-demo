//region require
let log4js = require('log4js')
log4js.configure('./log4js.json')
let logger = log4js.getLogger('default')
let util = require('util')
let RpcServer = require('./rpcServer')
let baseInterface = require('../base/baseInterface')
let enums = require('../../enums')
//endregion


function rpcInterface() {

    //region constructor
    //inherits
    if (!(this instanceof rpcInterface)) {
        return new rpcInterface()
    }
    baseInterface.call(this)
    util.inherits(rpcInterface, baseInterface)

    //set new value for prototype, must after inherits
    this.server = new RpcServer()
    baseInterface.prototype.className = "rpcInterface"

    this.init = function(mode){
        this.mode = mode
        this.url = mode.initParams.url
    }

    this.getName = function(){
        return "rpc@" + this.url
    }

    this.close = function(){
        logger.debug('All done!')
    }
    //endregion

    //region common methods
    rpcInterface.prototype.getResponse = function (server, methodName, params) {
        baseInterface.prototype.getResponse(server, methodName, params)
        return new Promise((resolve, reject) => {
            this.server.RPC_POST(this.url, methodName, params).then(function(data){
                if (data != null && JSON.stringify(data.result) !== '{}'){
                    logger.debug('---Result: ', data)  //important logger
                    resolve(data)
                }
                else{
                    rpcInterface.prototype.createError(data)
                }
            }, function (error) {
                resolve(rpcInterface.prototype.createError(error))
            })
        })
    }

    rpcInterface.prototype.createError = function(error){
        let result = {}
        result.status = enums.responseStatus.error
        result.error = error
        return result
    }

    rpcInterface.prototype.valueToAmount = function (value) {
        return (value * 1000000).toString()
    }

    rpcInterface.prototype.uploadFile = function (url, fileName){
        logger.debug('Trying to upload ' + fileName + ' to ' + url + '!')
        return new Promise((resolve, reject) => {
            this.server.RPC_UPLOAD(url, fileName).then(function(data){
                if (data != null && JSON.stringify(data.result) !== '{}'){
                    logger.debug('result: ', data)
                    resolve(data)
                }
                else{
                    reject('result format is wrong: ' + data)
                }
            }, function (err) {
                reject(err)
            })
        })
    }
    //endregion

}

module.exports = rpcInterface