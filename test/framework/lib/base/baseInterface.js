//region require
let log4js = require('log4js')
log4js.configure('./log4js.json')
let logger = log4js.getLogger('default')
const consts = require('../../consts')
const utility = require('../../testUtility')
let enums = require('../../enums')
let basicConfig = require('../../../config/basicConfig')
//endregion

function baseInterface() {

    this.id = 1

    //region constructor
    baseInterface.prototype.className = "baseInterface"
    baseInterface.prototype.mode = null

    if (!(this instanceof baseInterface)) {
        return new baseInterface()
    }

    baseInterface.prototype.printClassName = function(){
        logger.debug(this.className)
    }
    //endregion

    //region init and close

    baseInterface.prototype.init = function(mode){
        this.mode = mode
        this.name = mode.name
        this.url = mode.initParams.url
    }

    baseInterface.prototype.getName = function(){
        return this.name + '@' + this.url
    }

    //endregion

    //region interfaces

    //region block number

    baseInterface.prototype.createParamBlockNumber = function(type) {
        let param = {}
        param.type = type
        return param
    }

    baseInterface.prototype.responseBlockNumber = function(server, type) {
        let param = this.createParamBlockNumber(type)
        return this.getResponse(server, consts.rpcFunctions.getBlockNumber, [param])
    }

    baseInterface.prototype.getBlockNumber = async function(server, type){
        let response = await this.responseBlockNumber(server, type)
        let number
        if(response && !response.error && response.result && response.result[0] && response.result[0].result){
            if(type == 'number'){
                number = response.result[0].result
            }
            else if (type == 'info'){
                number = response.result[0].result[0]
            }
        }
        return number
    }

    //endregion

    //region balance

    baseInterface.prototype.createParamGetBalance = function(address, currency, issuer, ledger) {
        let param = {}
        param.address = address
        if(currency) param.currency = currency
        if(issuer) param.issuer = issuer
        if(ledger) param.ledger = ledger
        return param
    }

    baseInterface.prototype.responseGetBalance = function (server, address, currency, issuer, ledger) {
        let param = this.createParamGetBalance(address, currency, issuer, ledger)
        return this.getResponse(server, consts.rpcFunctions.getBalance, [param])
    }

    baseInterface.prototype.getBalance = async function (server, address, currency, issuer, ledger) {
        let response = await this.responseGetBalance(server, address, currency, issuer, ledger)
        let result = this.returnObjectInResponse(response)
        let balance = null
        if(result){
            balance = result.balance
        }
        return balance
    }

    //endregion

    //region new wallet

    baseInterface.prototype.createParamCreateWallet = function(type) {
        let param = {}
        param.type = type
        return param
    }

    baseInterface.prototype.responseCreateWallet = function (server, type) {
        let param = this.createParamCreateWallet(type)
        return this.getResponse(server, 'jt_createWallet', [param])
    }

    baseInterface.prototype.createWallet = async function(server, type){
        let response = await this.responseCreateWallet(server, type)
        return this.returnObjectInResponse(response)
    }

    //endregion

    //region account

    //region createAccount

    baseInterface.prototype.createParamCreateAccount = function(nickname, type) {
        let param = {}
        param.nick = nickname
        if(type) param.type = type
        return param
    }

    baseInterface.prototype.responseCreateAccount = function (server, nickname, type) {
        let param = this.createParamCreateAccount(nickname, type)
        return this.getResponse(server, consts.rpcFunctions.createAccount, [param])
    }

    baseInterface.prototype.createAccount = async function(server, nickname, type){
        let response = await this.responseCreateAccount(server, nickname, type)
        return this.returnObjectInResponse(response)
    }

    //endregion

    //region GetAccount

    baseInterface.prototype.createParamGetAccount = function(address, currency, issuer, ledger) {
        let param = {}
        param.address = address
        if(currency) param.currency = currency
        if(issuer) param.issuer = issuer
        if(ledger) param.ledger = ledger
        return param
    }

    baseInterface.prototype.responseGetAccount = function (server, address, currency, issuer, ledger) {
        let param = this.createParamGetAccount(address, currency, issuer, ledger)
        return this.getResponse(server, consts.rpcFunctions.getAccount, [param])
    }

    baseInterface.prototype.getAccount = async function (server, address, currency, issuer, ledger) {
        let response = await this.responseGetAccount(server, address, currency, issuer, ledger)
        return this.returnObjectInResponse(response)
    }

    baseInterface.prototype.getSequence = async function (server, address, currency, issuer, ledger) {
        let account = await this.getAccount(server, address, currency, issuer, ledger)
        let sequence
        if(account && account.Sequence){
            sequence = account.Sequence
        }
        else{
            sequence = -1
        }
        return sequence
    }

    //endregion

    //region GetAccounts

    baseInterface.prototype.responseGetAccounts = function (server, ) {
        let params = []
        return this.getResponse(server, consts.rpcFunctions.getAccounts, params)
    }

    //endregion

    //endregion

    //region currency

    baseInterface.prototype.createParamGetCurrency = function(currency, issuer, ledger) {
        let param = {}
        param.currency = currency
        if(issuer) param.issuer = issuer
        if(ledger) param.ledger = ledger
        return param
    }

    baseInterface.prototype.responseGetCurrency = function (server, currency, issuer, ledger) {
        let param = this.createParamGetCurrency(currency, issuer, ledger)
        return this.getResponse(server, consts.rpcFunctions.getCurrency, [param])
    }

    baseInterface.prototype.getCurrency = async function (server, currency, issuer, ledger) {
        let response = await this.responseGetAccount(server, currency, issuer, ledger)
        return this.returnObjectInResponse(response)
    }

    //endregion

    //region get tx

    //region get tx

    baseInterface.prototype.createParamGetTxByHash = function(hash, full, ledger) {
        let param = {}
        param.hash = hash
        if(full != undefined) param.full = full
        if(ledger) param.ledger = ledger
        return param
    }

    baseInterface.prototype.responseGetTxByHash = function (server, hash, full, ledger) {
        let param = this.createParamGetTxByHash(hash, full, ledger)
        return this.getResponse(server, consts.rpcFunctions.getTransactionByHash, [param])
    }

    baseInterface.prototype.getTxByHash = async function (server, hash, full, ledger) {
        let response = await this.responseGetTxByHash(server, hash, full, ledger)
        return this.returnObjectInResponse(response)
    }

    baseInterface.prototype.getTx = async function (server, hash, full, ledger) {
        return await this.getTxByHash(server, hash, full, ledger)
    }

    //endregion

    //region by index

    //jt_getTransactionByIndex

    baseInterface.prototype.createParamGetTxByIndex = function(address, sequence, full, ledger) {
        let param = {}
        param.address = address
        param.sequence = sequence
        if(full != undefined) param.full = full
        if(ledger) param.ledger = ledger
        return param
    }

    baseInterface.prototype.responseGetTxByIndex = function (server, address, sequence, full, ledger) {
        let param = this.createParamGetTxByIndex(address, sequence, full, ledger)
        return this.getResponse(server, consts.rpcFunctions.getTransactionByIndex, [param])
    }

    baseInterface.prototype.getTxByIndex = async function (server, address, sequence, full, ledger) {
        let response = await this.responseGetTxByHash(server, address, sequence, full, ledger)
        return this.returnObjectInResponse(response)
    }

    //endregion

    //region getTxByBlock

    baseInterface.prototype.createParamGetTxByBlockNumberAndIndex = function(blockNumber, index, full, ledger) {
        let param = {}
        param.number = blockNumber
        param.index = index
        if(full != undefined) param.full = full
        if(ledger) param.ledger = ledger
        return param
    }

    baseInterface.prototype.responseGetTxByBlockNumberAndIndex = function (server, blockNumber, index, full, ledger) {
        let param = this.createParamGetTxByBlockNumberAndIndex(blockNumber, index, full, ledger)
        return this.getResponse(server, consts.rpcFunctions.getTransactionByBlockNumberAndIndex, [param])
    }

    baseInterface.prototype.createParamGetTxByBlockHashAndIndex = function(blockHash, index, full, ledger) {
        let param = {}
        param.hash = blockHash
        param.index = index
        if(full != undefined) param.full = full
        if(ledger) param.ledger = ledger
        return param
    }

    baseInterface.prototype.responseGetTxByBlockHashAndIndex = function (server, blockHash, index, full, ledger) {
        let param = this.createParamGetTxByBlockHashAndIndex(blockHash, index, full, ledger)
        return this.getResponse(server, consts.rpcFunctions.getTransactionByBlockHashAndIndex, [param])
    }

    //endregion

    //endregion

    //region get tx count

    //region tx count

    baseInterface.prototype.createParamGetTransactionCount = function(address, ledger) {
        let param = {}
        param.address = address
        if(ledger) param.ledger = ledger
        return param
    }

    baseInterface.prototype.responseGetTransactionCount = function (server, address, ledger) {
        let param = this.createParamGetTransactionCount(address, ledger)
        return this.getResponse(server, consts.rpcFunctions.getTransactionCount, [param])
    }

    baseInterface.prototype.getTransactionCount = async function (server, address, ledger) {
        let response = await this.responseGetTransactionCount(server, address, ledger)
        return this.returnObjectInResponse(response)
    }

    //endregion

    //region by number

    baseInterface.prototype.createParamGetTxCountByBlockNumber = function(blockNumber, ledger) {
        let param = {}
        param.number = blockNumber
        if(ledger) param.ledger = ledger
        return param
    }

    baseInterface.prototype.responseGetTxCountByBlockNumber = function (server, blockNumber, ledger) {
        let param = this.createParamGetTxCountByBlockNumber(blockNumber, ledger)
        return this.getResponse(server, consts.rpcFunctions.getBlockTransactionCountByNumber, [param])
    }

    baseInterface.prototype.getTxCountByBlockNumber = async function (server, blockNumber, ledger) {
        let response = await this.responseGetTxCountByBlockNumber(server, blockNumber, ledger)
        return this.returnObjectInResponse(response)
    }

    //endregion

    //region by number

    baseInterface.prototype.createParamGetTxCountByHash = function(blockHash, ledger) {
        let param = {}
        param.hash = blockHash
        if(ledger) param.ledger = ledger
        return param
    }

    baseInterface.prototype.responseGetTxCountByHash = function (server, blockHash) {
        let param = this.createParamGetTxCountByHash(blockHash, ledger)
        return this.getResponse(server, consts.rpcFunctions.getBlockTransactionCountByHash, [param])
    }

    baseInterface.prototype.getTxCountByHash = async function (server, blockHash, ledger) {
        let response = await this.responseGetTxCountByHash(server, blockHash, ledger)
        return this.returnObjectInResponse(response)
    }

    //endregion

    //endregion

    //region get receipt

    baseInterface.prototype.createParamGetTransactionReceipt = function(hash, ledger) {
        let param = {}
        param.hash = hash
        if(ledger) param.ledger = ledger
        return param
    }

    baseInterface.prototype.responseGetTransactionReceipt = function (server, hash, ledger) {
        let param = this.createParamGetTransactionReceipt(hash, ledger)
        return this.getResponse(server, consts.rpcFunctions.getTransactionReceipt, [param])
    }

    baseInterface.prototype.getTransactionReceipt = async function (server, hash, ledger) {
        let response = await this.responseGetTransactionReceipt(server, hash, ledger)
        return this.returnObjectInResponse(response)
    }

    //endregion

    //region get block

    //region by number

    baseInterface.prototype.createParamGetBlockByNumber = function(blockNumber, full, ledger) {
        let param = {}
        param.number = blockNumber.toString()
        param.full = full
        if(ledger) param.ledger = ledger
        return param
    }

    baseInterface.prototype.responseGetBlockByNumber = function (server, blockNumber, full, ledger) {
        let param = this.createParamGetBlockByNumber(blockNumber, full, ledger)
        return this.getResponse(server, consts.rpcFunctions.getBlockByNumber, [param])
    }

    baseInterface.prototype.getBlockByNumber = async function (server, blockNumber, full, ledger) {
        let response = await this.responseGetBlockByNumber(server, blockNumber, full, ledger)
        return this.returnObjectInResponse(response)
    }

    //endregion

    //region by hash

    baseInterface.prototype.createParamGetBlockByHash = function(blockHash, full, ledger) {
        let param = {}
        param.hash = blockHash
        param.full = full
        if(ledger) param.ledger = ledger
        return param
    }

    baseInterface.prototype.responseGetBlockByHash = function (server, blockHash, full, ledger) {
        let param = this.createParamGetBlockByHash(blockHash, full, ledger)
        return this.getResponse(server, consts.rpcFunctions.getBlockByNumber, [param])
    }

    baseInterface.prototype.getBlockByHash = async function (server, blockHash, full, ledger) {
        let response = await this.responseGetBlockByHash(server, blockHash, full, ledger)
        return this.returnObjectInResponse(response)
    }

    //endregion

    //endregion

    //region send tx

    baseInterface.prototype.createTxParams = function (from, secret, sequence, to, value, fee, memos, type, name, symbol, decimals, total_supply, local, flags){
        let data = {}
        if(from != null) data.from = from
        if(secret != null) data.secret = secret
        if(sequence != null) data.sequence = sequence
        if(to != null) data.to = to
        if(value != null) {
            if(!utility.isJSON(value)){
                data.value = this.valueToAmount(value)
            }else{
                let amount = value.amount
                let symbol = value.symbol
                let issuer = value.issuer
                data.value = utility.getShowValue(amount, symbol, issuer)
            }
        }
        if(fee != null) data.fee = this.valueToAmount(fee)
        if(memos != null) data.memos = memos
        if(type != null) data.type = type
        if(name != null) data.name = name
        if(symbol != null) data.symbol = symbol
        if(decimals != null) data.decimals = decimals
        if(total_supply) data.total_supply = total_supply
        if(local != null) data.local = local
        if(flags != null) data.flags = flags
        let params = []
        params.push(data)
        return params
    }

    baseInterface.prototype.createTransferParams = function (from, secret, sequence, to, value, fee, memos){
        return this.createTxParams(from, secret, sequence, to, value, fee, memos)
    }

    baseInterface.prototype.createIssueTokenParams = function (from, secret, sequence, name, symbol, decimals, total_supply, local, flags, fee){
        return this.createTxParams(from, secret, sequence, null, null, fee, null,
            'IssueCoin', name, symbol, decimals, total_supply, local, flags)
    }

    baseInterface.prototype.responseSendTx = function (server, params){
        return this.getResponse(server, consts.rpcFunctions.sendTx, params)
    }

    //endregion

    // endregion

    //region common methods

    baseInterface.prototype.getResponse = function (server, methodName, params) {
        if(basicConfig.printImportantLog){
            logger.info('---Trying to invoke ' + methodName + ', by ' + server.getName() + '!')     //important logger
            logger.info('---Params: ' + JSON.stringify(params))   //important logger
        }
    }

    baseInterface.prototype.createError = function(error){
        let result = {}
        result.status = enums.responseStatus.error
        result.error = error
        return result
    }

    //convert value, because in old chain and new chain, value is different.  in old chain, value decimals is 6. in new chain, value must be integer.
    //todo: may be it is a bug.
    baseInterface.prototype.valueToAmount = function (value) {
        return value
    }

    baseInterface.prototype.createJsonRpcRequestContent = function(id, method, params){
        let data = {}
        data.jsonrpc = '2.0'
        data.id = id
        data.method = method
        data.params = params
        return data
    }

    baseInterface.prototype.returnObjectInResponse = function(response){
        let object
        if(response && !response.error && response.result && response.result[0] && response.result[0].result){
            object = response.result[0].result
        }
        return object
    }

    //endregion

}

module.exports = baseInterface
