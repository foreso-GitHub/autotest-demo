//region require
//region mocha
const chai = require('chai')
chai.use(require('chai-json-schema'))
const expect = chai.expect
//endregion
//region logger
let log4js = require('log4js')
log4js.configure('./log4js.json')
let logger = log4js.getLogger('default')
//endregion
//region test framework
const framework = require('../framework/framework')
const schema = require('../framework/schema')
const { responseStatus,  serviceType,  interfaceType,  testMode,  restrictedLevel, } = require("../framework/enums")
const consts = require('../framework/consts')
let utility = require('../framework/testUtility')
//endregion
//endregion

module.exports = tcsGetTx = {

    //region get tx check

    //region get tx by hash

    testForGetTransaction: function(server, describeTitle){

        //region fields

        let testScripts = []
        let testCaseCode
        let defaultScriptCode = '000100'
        let scriptCode

        let txs = server.mode.txs

        //endregion

        testCaseCode = 'FCJT_getTransactionByHash_000010'
        scriptCode = defaultScriptCode + '_查询有效交易哈希-底层币'
        {
            let hash = txs.tx1.hash
            let testScript = tcsGetTx.createTestScriptForGetTransaction(server, testCaseCode, scriptCode, hash)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_getTransactionByHash_000020'
        scriptCode = defaultScriptCode + '_查询有效交易哈希-token'
        {
            let hash = txs.tx_token.hash
            let testScript = tcsGetTx.createTestScriptForGetTransaction(server, testCaseCode, scriptCode, hash)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_getTransactionByHash_000030'
        scriptCode = defaultScriptCode + '_查询有效交易哈希-memos'
        {
            let hash = txs.tx_memo.hash
            let testScript = tcsGetTx.createTestScriptForGetTransaction(server, testCaseCode, scriptCode, hash)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_getTransactionByHash_000040'
        scriptCode = defaultScriptCode + '_查询无效交易哈希:数字'
        {
            let hash = 1231111
            let testScript = tcsGetTx.createTestScriptForGetTransaction(server, testCaseCode, scriptCode, hash)
            let expectedResult = framework.createExpecteResult(false,
                framework.getError(-269, 'hash is not string'))
            framework.changeExpectedResult(testScript, expectedResult)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_getTransactionByHash_000040'
        scriptCode = '000200' + '_查询无效交易哈希:字符串'
        {
            let hash = 'data.tx1.hash'
            let testScript = tcsGetTx.createTestScriptForGetTransaction(server, testCaseCode, scriptCode, hash)
            let expectedResult = framework.createExpecteResult(false,
                framework.getError(-269, 'invalid byte'))
            framework.changeExpectedResult(testScript, expectedResult)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_getTransactionByHash_000040'
        scriptCode = '000300' + '_查询无效交易哈希:参数为空'
        {
            let hash = null
            let testScript = tcsGetTx.createTestScriptForGetTransaction(server, testCaseCode, scriptCode, hash)
            let expectedResult = framework.createExpecteResult(false,
                framework.getError(-269, 'hash is null'))
            framework.changeExpectedResult(testScript, expectedResult)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_getTransactionByHash_000040'
        scriptCode = '000400' + '_无效交易哈希：不存在的hash'
        {
            let hash = 'B07647D61E6F7C4683E715004E2FB236D47DB64DF92F6504B71D6A1D4469530A'
            let testScript = tcsGetTx.createTestScriptForGetTransaction(server, testCaseCode, scriptCode, hash)
            let expectedResult = framework.createExpecteResult(false,
                framework.getError(140, 't find transaction'))
            framework.changeExpectedResult(testScript, expectedResult)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_getTransactionByHash_000040'
        scriptCode = '000500' + '_无效交易哈希：hash长度超过标准'
        {
            let hash = 'B07647D61E6F7C4683E715004E2FB236D47DB64DF92F6504B71D6A1D4469530A1F'
            let testScript = tcsGetTx.createTestScriptForGetTransaction(server, testCaseCode, scriptCode, hash)
            let expectedResult = framework.createExpecteResult(false,
                framework.getError(-189, 'index out of range'))
            framework.changeExpectedResult(testScript, expectedResult)
            framework.addTestScript(testScripts, testScript)
        }

        framework.testTestScripts(server, describeTitle, testScripts)
    },

    createTestScriptForGetTransaction: function(server, testCaseCode, scriptCode, hash,){

        let functionName = consts.rpcFunctions.getTransactionByHash
        let txParams = []
        txParams.push(hash)

        let testScript = framework.createTestScript(
            server,
            testCaseCode,
            scriptCode,
            [],
            restrictedLevel.L2,
            [serviceType.newChain, ],
            [],//[interfaceType.rpc,],//[interfaceType.rpc, interfaceType.websocket]
        )
        let action = framework.createTestAction(testScript, functionName, txParams,
            framework.executeTestActionForGet, tcsGetTx.checkTransaction, [{needPass:true}])
        testScript.actions.push(action)
        return testScript

    },

    checkTransaction: function(action){
        let response = action.actualResult
        let needPass = action.expectedResults[0].needPass
        framework.checkGetResponse(response)
        if(needPass){
            expect(response.result).to.be.jsonSchema(schema.TX_SCHEMA)
            let hash = action.txParams[0]
            // let hash = action.checkParams.hash
            expect(response.result.hash).to.be.equal(hash)
        }
        else{
            framework.checkResponseError(action, action.expectedResults[0], response)
        }
    },

    //endregion

    //region get tx by index

    testForGetTransactionByIndex: function(server, describeTitle){

        //region fields

        let testScripts = []
        let testCaseCode
        let defaultScriptCode = '000100'
        let scriptCode

        let txs = server.mode.txs
        let tx = txs.tx1
        let from = tx.Account
        let index = tx.Sequence

        //endregion

        testCaseCode = 'FCJT_getTransactionByIndex_000010'
        scriptCode = defaultScriptCode + '_token tx,有效的地址，有效的sequence'
        {
            tx = txs.tx_token
            from = tx.Account
            index = tx.Sequence
            let testScript = tcsGetTx.createTestScriptForGetTransactionByIndex(server, testCaseCode, scriptCode, from, index,)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_getTransactionByIndex_000010'
        scriptCode = '000200' + '_swt tx,有效的地址，有效的sequence'
        {
            tx = txs.tx1
            from = tx.Account
            index = tx.Sequence
            let testScript = tcsGetTx.createTestScriptForGetTransactionByIndex(server, testCaseCode, scriptCode, from, index,)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_getTransactionByIndex_000010'
        scriptCode = '000300' + '_swt tx,有效的地址，有效的sequence'
        {
            tx = txs.tx1
            from = tx.Account
            let lastIndex = 10

            let testScript = framework.createTestScript(
                server,
                testCaseCode,
                scriptCode,
                [],
                restrictedLevel.L2,
                [serviceType.newChain, ],
                [],//[interfaceType.rpc,],//[interfaceType.rpc, interfaceType.websocket]
            )

            for(let i = 1; i <= lastIndex; i++){
                index = i
                let functionName = consts.rpcFunctions.getTransactionByIndex
                let txParams = []
                txParams.push(from)
                txParams.push(index)
                let action = framework.createTestAction(testScript, functionName, txParams,
                    framework.executeTestActionForGet, tcsGetTx.checkTransactionByIndex, [{needPass:true}])
                testScript.actions.push(action)
            }

            framework.addTestScript(testScripts, testScript)

        }

        testCaseCode = 'FCJT_getTransactionByIndex_000020'
        scriptCode = defaultScriptCode + '_有效的地址，无效的sequence,很大的数值'
        {
            tx = txs.tx1
            from = tx.Account
            index = 99999999
            let testScript = tcsGetTx.createTestScriptForGetTransactionByIndex(server, testCaseCode, scriptCode, from, index,)
            let expectedResult = framework.createExpecteResult(false,
                framework.getError(140, 't find transaction'))
            framework.changeExpectedResult(testScript, expectedResult)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_getTransactionByIndex_000020'
        scriptCode = '000200' + '_有效的地址，无效的sequence,0'
        {
            tx = txs.tx1
            from = tx.Account
            index = 0
            let testScript = tcsGetTx.createTestScriptForGetTransactionByIndex(server, testCaseCode, scriptCode, from, index,)
            let expectedResult = framework.createExpecteResult(false,
                framework.getError(140, 't find transaction'))
            framework.changeExpectedResult(testScript, expectedResult)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_getTransactionByIndex_000020'
        scriptCode = '000300' + '_有效的地址，无效的sequence,负数'
        {
            tx = txs.tx1
            from = tx.Account
            index = -1
            let testScript = tcsGetTx.createTestScriptForGetTransactionByIndex(server, testCaseCode, scriptCode, from, index,)
            let expectedResult = framework.createExpecteResult(false,
                framework.getError(-269, 'index or sequence should be >= 0'))
            framework.changeExpectedResult(testScript, expectedResult)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_getTransactionByIndex_000020'
        scriptCode = '000400' + '_有效的地址，无效的sequence,小数'
        {
            tx = txs.tx1
            from = tx.Account
            index = 5.87
            let testScript = tcsGetTx.createTestScriptForGetTransactionByIndex(server, testCaseCode, scriptCode, from, index,)
            let expectedResult = framework.createExpecteResult(false,
                framework.getError(-269, 'index or sequence is not integer'))
            framework.changeExpectedResult(testScript, expectedResult)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_getTransactionByIndex_000020'
        scriptCode = '000500' + '_有效的地址，无效的sequence,乱码字符串'
        {
            tx = txs.tx1
            from = tx.Account
            index = 'sjdflsajf32241kjksd'
            let testScript = tcsGetTx.createTestScriptForGetTransactionByIndex(server, testCaseCode, scriptCode, from, index,)
            let expectedResult = framework.createExpecteResult(false,
                framework.getError(-269, 'index or sequence is not integer'))
            framework.changeExpectedResult(testScript, expectedResult)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_getTransactionByIndex_000030'
        scriptCode = defaultScriptCode + '_无效的地址参数_01：地址长度不够'
        {
            from = 'jpRhBgu4KZAyW9pMv4ckrxVYSvgG9ZuSV'
            index = 1
            let testScript = tcsGetTx.createTestScriptForGetTransactionByIndex(server, testCaseCode, scriptCode, from, index,)
            let expectedResult = framework.createExpecteResult(false,
                framework.getError(-96, 'Bad account address'))
            framework.changeExpectedResult(testScript, expectedResult)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_getTransactionByIndex_000030'
        scriptCode = '000200' + '_无效的地址参数_01：地址长度过长'
        {
            from = 'jpRhBgu4KZAyW9pMv4ckrxVYSvgG9ZuSVm1'
            index = 1
            let testScript = tcsGetTx.createTestScriptForGetTransactionByIndex(server, testCaseCode, scriptCode, from, index,)
            let expectedResult = framework.createExpecteResult(false,
                framework.getError(-96, 'Bad account address'))
            framework.changeExpectedResult(testScript, expectedResult)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_getTransactionByIndex_000030'
        scriptCode = '000200' + '_无效的地址参数_01：地址不以j开头'
        {
            from = 'tpRhBgu4KZAyW9pMv4ckrxVYSvgG9ZuSVm'
            index = 1
            let testScript = tcsGetTx.createTestScriptForGetTransactionByIndex(server, testCaseCode, scriptCode, from, index,)
            let expectedResult = framework.createExpecteResult(false,
                framework.getError(-96, 'Bad account address'))
            framework.changeExpectedResult(testScript, expectedResult)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_getTransactionByIndex_000040'
        scriptCode = defaultScriptCode + '_无效的地址参数_02：未激活的地址'
        {
            from = server.mode.addresses.inactiveAccount1.address
            index = 1
            let testScript = tcsGetTx.createTestScriptForGetTransactionByIndex(server, testCaseCode, scriptCode, from, index,)
            let expectedResult = framework.createExpecteResult(false,
                framework.getError(140, 't find transaction'))
            framework.changeExpectedResult(testScript, expectedResult)
            framework.addTestScript(testScripts, testScript)
        }

        framework.testTestScripts(server, describeTitle, testScripts)
    },

    createTestScriptForGetTransactionByIndex: function(server, testCaseCode, scriptCode, from, index){

        let functionName = consts.rpcFunctions.getTransactionByIndex
        let txParams = []
        txParams.push(from)
        txParams.push(index)

        let testScript = framework.createTestScript(
            server,
            testCaseCode,
            scriptCode,
            [],
            restrictedLevel.L2,
            [serviceType.newChain, ],
            [],//[interfaceType.rpc,],//[interfaceType.rpc, interfaceType.websocket]
        )
        let action = framework.createTestAction(testScript, functionName, txParams,
            framework.executeTestActionForGet, tcsGetTx.checkTransactionByIndex, [{needPass:true}])
        testScript.actions.push(action)
        return testScript

    },

    checkTransactionByIndex: function(action){
        let response = action.actualResult
        let needPass = action.expectedResults[0].needPass
        framework.checkGetResponse(response)
        if(needPass){
            expect(response.result).to.be.jsonSchema(schema.TX_SCHEMA)
            let from = action.txParams[0]
            let index = action.txParams[1]
            expect(response.result.Account).to.be.equal(from)
            expect(response.result.Sequence).to.be.equal(index)
        }
        else{
            framework.checkResponseError(action, action.expectedResults[0], response)
        }
    },

    //endregion

    //region get tx by block and index

    testForGetTransactionByBlockHashAndIndex: function(server, describeTitle){
        let txs = server.mode.txs
        let testCases = []
        let functionName = consts.rpcFunctions.getTransactionByBlockHashAndIndex

        let title = '0010\t有效区块哈希，有效交易索引'
        let hash = txs.block.blockHash
        let index = txs.tx1.meta.TransactionIndex.toString()
        let needPass = true
        let expectedError = ''
        let testCase = tcsGetTx.createSingleTestCaseForGetTransactionByBlockAndIndex(server, title, functionName, hash, index, needPass, expectedError)
        testCase.supportedServices = [serviceType.newChain,]
        framework.addTestScript(testCases, testCase)

        title = '0010\t有效区块哈希，有效交易索引:查询有效区块编号，遍历所有有效交易索引'
        hash = txs.block.blockHash
        testCase = tcsGetTx.createSingleTestCaseForGoThroughTxsInBlockByBlockHash(server, title, hash)
        testCase.supportedServices = [serviceType.newChain,]
        framework.addTestScript(testCases, testCase)

        title = '0020\t有效区块哈希，无效交易索引无效交易索引:100'
        hash = txs.block.blockHash
        index = '999999'
        needPass = false
        expectedError = framework.getError(140, 'no such transaction in block')
        testCase = tcsGetTx.createSingleTestCaseForGetTransactionByBlockAndIndex(server, title, functionName, hash, index, needPass, expectedError)
        testCase.supportedServices = [serviceType.newChain,]
        framework.addTestScript(testCases, testCase)

        title = '0020\t有效区块哈希，无效交易索引无效交易索引:负数'
        hash = txs.block.blockHash
        index = '-1'
        needPass = false
        expectedError = framework.getError(-189, 'index out of range')
        testCase = tcsGetTx.createSingleTestCaseForGetTransactionByBlockAndIndex(server, title, functionName, hash, index, needPass, expectedError)
        testCase.supportedServices = [serviceType.newChain,]
        framework.addTestScript(testCases, testCase)

        title = '0020\t有效区块哈希，无效交易索引无效交易索引:乱码'
        hash = txs.block.blockHash
        index = 'asdf'
        needPass = false
        expectedError = framework.getError(-269, 'index is not integer')
        testCase = tcsGetTx.createSingleTestCaseForGetTransactionByBlockAndIndex(server, title, functionName, hash, index, needPass, expectedError)
        testCase.supportedServices = [serviceType.newChain,]
        framework.addTestScript(testCases, testCase)

        title = '0030\t无效区块哈希'
        hash = 'B07647D61E6F7C4683E715004E2FB236D47DB64DF92F6504B71D6A1D4469530A'
        index = '0'
        needPass = false
        expectedError = framework.getError(140, 't find block')
        testCase = tcsGetTx.createSingleTestCaseForGetTransactionByBlockAndIndex(server, title, functionName, hash, index, needPass, expectedError)
        testCase.supportedServices = [serviceType.newChain,]
        framework.addTestScript(testCases, testCase)

        framework.testTestScripts(server, describeTitle, testScripts)
    },

    testForGetTransactionByBlockNumberAndIndex: function(server, describeTitle){
        let txs = server.mode.txs
        let testCases = []
        let functionName = consts.rpcFunctions.getTransactionByBlockNumberAndIndex

        let tx1 = txs.tx1
        let title = '0010\t有效区块哈希，有效交易索引'
        let blockNumber = tx1.ledger_index.toString()
        let index = txs.tx1.meta.TransactionIndex.toString()
        let needPass = true
        let expectedError = ''
        let testCase = tcsGetTx.createSingleTestCaseForGetTransactionByBlockAndIndex(server, title, functionName, blockNumber, index, needPass, expectedError)
        testCase.supportedServices = [serviceType.newChain,]
        framework.addTestScript(testCases, testCase)

        title = '0010\t有效区块编号，有效交易索引:查询有效区块编号，遍历所有有效交易索引'
        blockNumber = txs.block.blockNumber
        testCase = tcsGetTx.createSingleTestCaseForGoThroughTxsInBlockByBlockNumber(server, title, blockNumber)
        testCase.supportedServices = [serviceType.newChain,]
        framework.addTestScript(testCases, testCase)

        //todo need restore when these tags are supported.
        // title = '0010\t有效区块编号，有效交易索引:查询有效区块编号earliest，遍历所有有效交易索引'
        // blockNumber = "earliest"
        // testCase = tcsGetTx.createSingleTestCaseForGoThroughTxsInBlockByBlockNumber(server, title, blockNumber)
        // testCase.supportedServices = [serviceType.newChain,]
        // framework.addTestScript(testCases, testCase)
        //
        // title = '0010\t有效区块编号，有效交易索引:查询有效区块编号latest，遍历所有有效交易索引'
        // blockNumber = "latest"
        // testCase = tcsGetTx.createSingleTestCaseForGoThroughTxsInBlockByBlockNumber(server, title, blockNumber)
        // testCase.supportedServices = [serviceType.newChain,]
        // framework.addTestScript(testCases, testCase)
        //
        // title = '0010\t有效区块编号，有效交易索引:查询有效区块编号pending，遍历所有有效交易索引'
        // blockNumber = "pending"
        // testCase = tcsGetTx.createSingleTestCaseForGoThroughTxsInBlockByBlockNumber(server, title, blockNumber)
        // testCase.supportedServices = [serviceType.newChain,]
        // framework.addTestScript(testCases, testCase)

        title = '0020\t有效区块编号，无效交易索引无效交易索引:100'
        blockNumber = tx1.ledger_index.toString()
        index = '100'
        needPass = false
        expectedError = framework.getError(140, 'no such transaction in block')
        testCase = tcsGetTx.createSingleTestCaseForGetTransactionByBlockAndIndex(server, title, functionName, blockNumber, index, needPass, expectedError)
        testCase.supportedServices = [serviceType.newChain,]
        framework.addTestScript(testCases, testCase)

        title = '0020\t有效区块编号，无效交易索引无效交易索引:负数'
        blockNumber = tx1.ledger_index.toString()
        index = '-1'
        needPass = false
        expectedError = framework.getError(-189, 'index out of range')
        testCase = tcsGetTx.createSingleTestCaseForGetTransactionByBlockAndIndex(server, title, functionName, blockNumber, index, needPass, expectedError)
        testCase.supportedServices = [serviceType.newChain,]
        framework.addTestScript(testCases, testCase)

        title = '0020\t有效区块编号，无效交易索引无效交易索引:乱码'
        blockNumber = tx1.ledger_index.toString()
        index = 'asdf'
        needPass = false
        expectedError = framework.getError(-269, 'index is not integer')
        testCase = tcsGetTx.createSingleTestCaseForGetTransactionByBlockAndIndex(server, title, functionName, blockNumber, index, needPass, expectedError)
        testCase.supportedServices = [serviceType.newChain,]
        framework.addTestScript(testCases, testCase)

        title = '0030\t无效区块编号'
        blockNumber = '999999999'
        index = '0'
        needPass = false
        expectedError = framework.getError(140, 't find block')
        testCase = tcsGetTx.createSingleTestCaseForGetTransactionByBlockAndIndex(server, title, functionName, blockNumber, index, needPass, expectedError)
        testCase.supportedServices = [serviceType.newChain,]
        framework.addTestScript(testCases, testCase)

        framework.testTestScripts(server, describeTitle, testScripts)
    },

    createSingleTestCaseForGetTransactionByBlockAndIndex: function(server, title, functionName,
                                                                            hashOrNumber, index, needPass, expectedError){

        let txParams = []
        txParams.push(hashOrNumber)
        txParams.push(index)

        let expectedResult = {}
        expectedResult.needPass = needPass
        expectedResult.isErrorInResult = true
        expectedResult.expectedError = expectedError

        let testCase = framework.createTestCase(
            title,
            server,
            functionName,
            txParams,
            null,
            framework.executeTestActionForGet,
            tcsGetTx.checkTransactionByBlockHashAndIndex,
            expectedResult,
            restrictedLevel.L2,
            [serviceType.newChain,],
            [],//[interfaceType.rpc,],//[interfaceType.rpc, interfaceType.websocket]
        )

        return testCase
    },

    checkTransactionByBlockHashAndIndex: function(action){
        let response = action.actualResult
        let needPass = action.expectedResults[0].needPass
        framework.checkGetResponse(response)
        if(needPass){
            expect(response.result).to.be.jsonSchema(schema.TX_SCHEMA)
            let tx1 = action.server.mode.txs.tx1
            framework.compareTx(response.result, tx1)
        }
        else{
            framework.checkResponseError(action, action.expectedResults[0], response)
        }
    },

    createSingleTestCaseForGoThroughTxsInBlockByBlockHash: function(server, title, hash){
        // todo: need consider how to combine these 2 similar functions.
        // try to combine number and hash function but failed.
        // because use function as param will cause 'this' in function direct to other value, response function cannot be found.
        // let getCountFunc = numberOrHash.length == HASH_LENGTH ? server.responseGetTxCountByHash : server.responseGetTxCountByBlockNumber
        // let getTxFunc = numberOrHash.length == HASH_LENGTH ? server.responseGetTxByBlockHashAndIndex : server.responseGetTxByBlockNumberAndIndex

        return framework.createTestCase(
            title,
            server,
            '',
            null,
            null,
            function(testCase){
                testCase.hasExecuted = true
                return server.responseGetTxCountByHash(server, hash).then(async(countResponse)=> {
                    // testCase.hasExecuted = true
                    testCase.actualResult.push(countResponse)
                })
            },
            async function(testCase){
                let countResponse = testCase.actualResult[0]
                framework.checkResponse(true, countResponse)
                let txCount = Number(countResponse.result)
                let finishCount = 0
                for(let i = 0; i < txCount; i++){
                    await Promise.resolve(server.responseGetTxByBlockHashAndIndex(server, hash, i.toString())).then(function (response) {
                        framework.checkResponse(true, response)
                        finishCount++
                    })
                }
                if(finishCount == txCount){
                    logger.debug("遍历所有有效交易索引成功，共查询到" + txCount + "条交易!")
                }
                else{
                    logger.debug("遍历所有有效交易索引失败，应该有" + txCount + "条交易，实际查询到" + finishCount + "条交易!")
                    expect(false).to.be.ok
                }
            },
            null,
            restrictedLevel.L2,
            [serviceType.newChain,],
            [],//[interfaceType.rpc, interfaceType.websocket]
        )
    },

    createSingleTestCaseForGoThroughTxsInBlockByBlockNumber: function(server, title, number){
        // todo: need consider how to combine these 2 similar functions.
        return framework.createTestCase(
            title,
            server,
            '',
            null,
            null,
            function(testCase){  //execute function
                testCase.hasExecuted = true
                return server.responseGetTxCountByBlockNumber(server, number).then(async(countResponse)=> {
                    // testCase.hasExecuted = true
                    testCase.actualResult.push(countResponse)
                })
            },
            async function(testCase){  //check function
                let countResponse = testCase.actualResult[0]
                framework.checkResponse(true, countResponse)
                let txCount = Number(countResponse.result)
                let finishCount = 0
                for(let i = 0; i < txCount; i++){
                    await Promise.resolve(server.responseGetTxCountByBlockNumber(server, number, i.toString())).then(function (response) {
                        framework.checkResponse(true, response)
                        finishCount++
                    })
                }
                if(finishCount == txCount){
                    logger.debug("遍历所有有效交易索引成功，共查询到" + txCount + "条交易!")
                }
                else{
                    logger.debug("遍历所有有效交易索引失败，应该有" + txCount + "条交易，实际查询到" + finishCount + "条交易!")
                    expect(false).to.be.ok
                }
            },
            null,
            restrictedLevel.L2,
            [serviceType.newChain,],
            [],//[interfaceType.rpc, interfaceType.websocket]
        )
    },

    //endregion

    //endregion

}
