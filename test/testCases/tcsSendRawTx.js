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
const { token, } = require("../testData/testData")
//endregion
//endregion

//region fail raw txs
//this is root account send to 'jBykxUHVDccTYtquCSCsFVgem1zt3FFe71' in sequence = 1
let _FailRawTx_UsedSequence = {tx: '120000228000000024000000016101800000000000000168800000000000000a73210330e7fc9d56bb25d6893ba3f317ae5bcf33b3291bd63db32654a313222f7fd02074463044022057cac2f744ce21ce13ed7c41a4f519bf8c569f8ea68b9b3feafb851a1dcc01b70220192bbddbca368c916b7618cb7878b1a301adf6791d029bf8dc06319b8582bede8114b5f762798a53d543a014caf8b297cff8f2f937e88314d558d3da6b2a93d132e5b5a9c90040d77e62fd6ef9ea7d094661696c5261775478e1f1',
    txParam: {
        "from": "jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh",
        "secret":"snoPBjXtMeMyMHUVTgbuqAfg1SUTb",
        "to": "jLTnL6yUXwuhR1uL3FLTMwG1r4PxZaUECM",
        "value": "1",
        "fee": "10",
        "memos": [
            "FailRawTx"
        ],
        "sequence": 1
    },
    code: -284, information: 'Malformed: Sequence is not in the past.'}
let _FailRawTx_InactiveAccount = {tx: '120000228000000024000000016101800000000000000168800000000000000a7321ed63680a29c71ba5c9e40e16d16ee15497b8034f62851474515856cb55b471664a74403c8f78726c81c88473ae473438264a4a9e46f9aea0791435a8ab96265537b1242adff7969bfd74df5cec0041b0671126f35042ba73628a6c548f7d97a782f807811446e3633d5d699f404bc1a44769ba19d26a4e68878314d558d3da6b2a93d132e5b5a9c90040d77e62fd6ef9ea7d094661696c5261775478e1f1',
    txParam: {
        "from": "jfTF6bmLpVPWS256LVQW9RLGn8atNut1Gg",
        "secret":"sEd7RBMDHJzBLRRnz9rKqLCWS7NU14K",
        "to": "jLTnL6yUXwuhR1uL3FLTMwG1r4PxZaUECM",
        "value": "1",
        "fee": "10",
        "memos": [
            "FailRawTx"
        ],
        "sequence": 1
    },
    code: -96, information: 'The source account does not exist.'}
let _FailRawTx_LessFund = {tx: '1200002280000000240001869f61018de0b6aef22006c068800000000000000a73210330e7fc9d56bb25d6893ba3f317ae5bcf33b3291bd63db32654a313222f7fd020744730450221008f103ce58ee9a6ca842c9c88843b2ab43ab17cb6eb345329192527966c31610d02206ba81458ed9388a31d35232ac60cf887d9bc30e4600be9e29695ccfbb12953f68114b5f762798a53d543a014caf8b297cff8f2f937e88314d558d3da6b2a93d132e5b5a9c90040d77e62fd6ef9ea7d094661696c5261775478e1f1',
    txParam: {
        "from": "jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh",
        "secret":"snoPBjXtMeMyMHUVTgbuqAfg1SUTb",
        "to": "jLTnL6yUXwuhR1uL3FLTMwG1r4PxZaUECM",
        "value": "999999979779000000",
        "fee": "10",
        "memos": [
            "FailRawTx"
        ],
        "sequence": 99999
    },
    code: -394, information: 'Fee insufficient.'}
let _FailRawTx_EmptyRawTx = {tx: '',
    code: -278, information: 'empty raw transaction'}
let _FailRawTx_WrongFormat_1 = {tx: '120000228000000024000f24cb61400009184e729fff68400000000000000a732102064d6800ea3fb2de01804f4d7257088eeec355c516548ec8c029ea9c6fc98b927446304402201617e755869b46252cdcaf0d1647b05029b55a67abe80ef877b796b765527da102205acf91905badfe2163a8ce7b64a360b69327399b04d1f21aafe863f684bd22fd8114e7dbc7c57517887e4c17c81e083d2ca0df6945a083144ea5258eb18f44b05e135a3833df5fc8efc466ecf9ea7d084141414141414141e1f1a',
    code: -278, information: 'encoding/hex: odd length hex string'}
let _FailRawTx_WrongFormat_2 = {tx: '120000228000000024000f24cb61400009184e729fff68400000000000000a732102064d6800ea3fb2de01804f4d7257088eeec355c516548ec8c029ea9c6fc98b927446304402201617e755869b46252cdcaf0d1647b05029b55a67abe80ef877b796b765527da102205acf91905badfe2163a8ce7b64a360b69327399b04d1f21aafe863f684bd22fd8114e7dbc7c57517887e4c17c81e083d2ca0df6945a083144ea5258eb18f44b05e135a3833df5fc8efc466ecf9ea7d084141414141414141e1fa',
    code: -173, information: 'Missing field:  &{typ:4 field:0}'}
let _FailRawTx_WrongFormat_3 = {tx: 123123,
    code: -269, information: 'tx blob is not string'}
let _FailRawTx_WrongFormat_4 = {tx: null,
    code: -269, information: 'tx blob is null'}
//endregion

module.exports = tcsSendRawTx = {

    //region normal send raw tx

    testForSendRawTx: function(server, describeTitle){

        let testScripts = []
        let testCaseCode
        let defaultScriptCode = '000100'
        let scriptCode
        let txFunctionName = consts.rpcFunctions.sendRawTx
        let txParams = framework.createTxParamsForTransfer(server)

        testCaseCode = 'FCJT_sendRawTransaction_000010'
        scriptCode = defaultScriptCode
        {
            let successCount = 1
            let successTxParams = tcsSendRawTx.createSuccessTxParams(successCount, txParams[0])

            let failCount = 0
            let failTxs = tcsSendRawTx.createFailTxs(failCount, _FailRawTx_InactiveAccount)

            let testScript = tcsSendRawTx.createTestScript(server, testCaseCode, scriptCode, successTxParams, failTxs)

            framework.addTestScript(testScripts, testScript)
        }

        //region different error raw tx like not_enough_fund, bad_format_tx, etc

        testCaseCode = 'FCJT_sendRawTransaction_000020'
        scriptCode = defaultScriptCode + '_使用过的Sequence'
        {
            let successTxParams = []
            let failTxs = []
            failTxs.push(_FailRawTx_UsedSequence)
            let testScript = tcsSendRawTx.createTestScript(server, testCaseCode, scriptCode, successTxParams, failTxs)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_sendRawTransaction_000020'
        scriptCode = '000200_未激活的发送帐号'
        {
            let successTxParams = []
            let failTxs = []
            failTxs.push(_FailRawTx_InactiveAccount)
            let testScript = tcsSendRawTx.createTestScript(server, testCaseCode, scriptCode, successTxParams, failTxs)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_sendRawTransaction_000020'
        scriptCode = '000300_余额不足'
        {
            let successTxParams = []
            let failTxs = []
            failTxs.push(_FailRawTx_LessFund)
            let testScript = tcsSendRawTx.createTestScript(server, testCaseCode, scriptCode, successTxParams, failTxs)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_sendRawTransaction_000020'
        scriptCode = '000400_空交易'
        {
            let testScript = framework.createTestScriptForTx(server, testCaseCode, scriptCode, txFunctionName, txParams)
            let failTx = _FailRawTx_EmptyRawTx
            let expectedResults = [framework.createExpecteResult(false, framework.getError(failTx.code, failTx.information))]
            let sendRawTxAction = framework.createTestAction(testScript, consts.rpcFunctions.sendRawTx, [failTx.tx],
                framework.executeTestActionOfSendRawTx,
                framework.checkTestActionOfSendTx,
                expectedResults)
            // framework.addSignTxAction(sendRawTxAction, signTxAction)
            testScript.actions.push(sendRawTxAction)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_sendRawTransaction_000020'
        scriptCode = '000500_参数为空数组'
        {
            let testScript = framework.createTestScriptForTx(server, testCaseCode, scriptCode, txFunctionName, txParams)
            // let failTx = _FailRawTx_EmptyRawTx
            // let expectedResults = [framework.createExpecteResult(false, framework.getError(failTx.code, failTx.information))]
            let sendRawTxAction = framework.createTestAction(testScript, consts.rpcFunctions.sendRawTx, [],
                framework.executeTestActionOfSendRawTx,
                framework.checkTestActionOfSendTx,
                [{"neePass": false}])
            // framework.addSignTxAction(sendRawTxAction, signTxAction)
            testScript.actions.push(sendRawTxAction)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_sendRawTransaction_000020'
        scriptCode = '000600_错误的rawTx格式1'
        {
            let testScript = framework.createTestScriptForTx(server, testCaseCode, scriptCode, txFunctionName, txParams)
            let failTx = _FailRawTx_WrongFormat_1
            let expectedResults = [framework.createExpecteResult(false, framework.getError(failTx.code, failTx.information))]
            let sendRawTxAction = framework.createTestAction(testScript, consts.rpcFunctions.sendRawTx, [failTx.tx],
                framework.executeTestActionOfSendRawTx,
                framework.checkTestActionOfSendTx,
                expectedResults)
            testScript.actions.push(sendRawTxAction)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_sendRawTransaction_000020'
        scriptCode = '000700_错误的rawTx格式2'
        {
            let testScript = framework.createTestScriptForTx(server, testCaseCode, scriptCode, txFunctionName, txParams)
            let failTx = _FailRawTx_WrongFormat_2
            let expectedResults = [framework.createExpecteResult(false, framework.getError(failTx.code, failTx.information))]
            let sendRawTxAction = framework.createTestAction(testScript, consts.rpcFunctions.sendRawTx, [failTx.tx],
                framework.executeTestActionOfSendRawTx,
                framework.checkTestActionOfSendTx,
                expectedResults)
            testScript.actions.push(sendRawTxAction)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_sendRawTransaction_000020'
        scriptCode = '000800_错误的rawTx格式3'
        {
            let testScript = framework.createTestScriptForTx(server, testCaseCode, scriptCode, txFunctionName, txParams)
            let failTx = _FailRawTx_WrongFormat_3
            let expectedResults = [framework.createExpecteResult(false, framework.getError(failTx.code, failTx.information))]
            let sendRawTxAction = framework.createTestAction(testScript, consts.rpcFunctions.sendRawTx, [failTx.tx],
                framework.executeTestActionOfSendRawTx,
                framework.checkTestActionOfSendTx,
                expectedResults)
            testScript.actions.push(sendRawTxAction)
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_sendRawTransaction_000020'
        scriptCode = '000900_错误的rawTx格式4'
        {
            let testScript = framework.createTestScriptForTx(server, testCaseCode, scriptCode, txFunctionName, txParams)
            let failTx = _FailRawTx_WrongFormat_4
            let expectedResults = [framework.createExpecteResult(false, framework.getError(failTx.code, failTx.information))]
            let sendRawTxAction = framework.createTestAction(testScript, consts.rpcFunctions.sendRawTx, [failTx.tx],
                framework.executeTestActionOfSendRawTx,
                framework.checkTestActionOfSendTx,
                expectedResults)
            testScript.actions.push(sendRawTxAction)
            framework.addTestScript(testScripts, testScript)
        }

        //endregion

        testCaseCode = 'FCJT_sendRawTransaction_000030'
        scriptCode = defaultScriptCode
        {
            let successCount = 10
            let successTxParams = tcsSendRawTx.createSuccessTxParams(successCount, txParams[0])

            let failCount = 0
            let failTxs = tcsSendRawTx.createFailTxs(failCount, _FailRawTx_InactiveAccount)

            let testScript = tcsSendRawTx.createTestScript(server, testCaseCode, scriptCode, successTxParams, failTxs)

            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_sendRawTransaction_000040'
        scriptCode = defaultScriptCode
        {
            let successCount = 0
            let successTxParams = tcsSendRawTx.createSuccessTxParams(successCount, txParams[0])

            let failCount = 10
            let failTxs = tcsSendRawTx.createFailTxs(failCount, _FailRawTx_InactiveAccount)

            let testScript = tcsSendRawTx.createTestScript(server, testCaseCode, scriptCode, successTxParams, failTxs)

            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_sendRawTransaction_000050'
        scriptCode = defaultScriptCode
        {
            let successCount = 10
            let successTxParams = tcsSendRawTx.createSuccessTxParams(successCount, txParams[0])

            let failCount = 10
            let failTxs = tcsSendRawTx.createFailTxs(failCount, _FailRawTx_InactiveAccount)

            let testScript = tcsSendRawTx.createTestScript(server, testCaseCode, scriptCode, successTxParams, failTxs)

            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_sendRawTransaction_000060'
        scriptCode = defaultScriptCode + '_输入上千、上万个有效的交易数据'
        {
            let successCount = 1000
            let successTxParams = tcsSendRawTx.createSuccessTxParams(successCount, txParams[0])

            let failCount = 0
            let failTxs = tcsSendRawTx.createFailTxs(failCount, _FailRawTx_InactiveAccount)

            let testScript = tcsSendRawTx.createTestScript(server, testCaseCode, scriptCode, successTxParams, failTxs)
            testScript.restrictedLevel = restrictedLevel.L5
            framework.addTestScript(testScripts, testScript)
        }

        testCaseCode = 'FCJT_sendRawTransaction_000070'
        scriptCode = defaultScriptCode + '_输入上万、几十万个无效的交易数据'
        {
            let successCount = 0
            let successTxParams = tcsSendRawTx.createSuccessTxParams(successCount, txParams[0])

            let failCount = 10000
            let failTxs = tcsSendRawTx.createFailTxs(failCount, _FailRawTx_InactiveAccount)

            let testScript = tcsSendRawTx.createTestScript(server, testCaseCode, scriptCode, successTxParams, failTxs)
            testScript.restrictedLevel = restrictedLevel.L5
            framework.addTestScript(testScripts, testScript)
        }

        framework.testTestScripts(server, describeTitle, testScripts)
    },

    createTestScript: function(server, testCaseCode, scriptCode, successTxParams, failTxs){
        let txFunctionName = consts.rpcFunctions.sendRawTx
        let txParams = successTxParams

        let expectedResults = []

        for(let i = 0; i < successTxParams.length; i++){
            expectedResults.push({needPass: true})
        }

        for(let i = 0; i < failTxs.length; i++){
            let failTx = failTxs[i]
            txParams.push(failTx.txParam)
            expectedResults.push(framework.createExpecteResult(false, framework.getError(failTx.code, failTx.information)))
        }

        let testScript = framework.createTestScriptForTx(server, testCaseCode, scriptCode, txFunctionName, txParams)

        let signTxAction = framework.createTestAction(testScript, consts.rpcFunctions.signTx, txParams,
            framework.executeTestActionOfSendTx,null,{})
        testScript.actions.push(signTxAction)

        let sendRawTxAction = framework.createTestAction(testScript, consts.rpcFunctions.sendRawTx, [],
            framework.executeTestActionOfSendRawTx,
            framework.checkTestActionOfSendTx,
            expectedResults)
        framework.addSignTxAction(sendRawTxAction, signTxAction)
        testScript.actions.push(sendRawTxAction)

        return testScript
    },

    createSuccessTxParams: function(successCount, txParam){
        let successTxParams = []
        for(let i = 0; i < successCount; i++){
            successTxParams.push(txParam)
        }
        return successTxParams
    },

    createFailTxs: function(failCount, failTx){
        let failTxs = []
        for(let i = 0; i < failCount; i++){
            failTxs.push(failTx)
        }
        return failTxs
    },

    //endregion

    //region performance test by sign and sendRaw
    testForPerformanceTestBySendRaw: function(server, describeTitle, testCountOfPerRound, testRound){
        let title
        let testCase
        let testCases = []
        let subCaseFunctionParams
        let caseRestrictedLevel = restrictedLevel.L2
        let allServers = framework.activeAllRpcServers()
        let serverCount = allServers.length

        let addresses = server.mode.addresses
        let account1= addresses.sender3
        let account2= addresses.receiver3
        let currency = {symbol:consts.default.nativeCoin, issuer:''}
        let txFunction = consts.rpcFunctions.signTx
        let successCount = testCountOfPerRound
        let failRawTxs = []

        title = '1000\t性能测试，sendRaw，多个有效交易数据：' + successCount
        {
            subCaseFunctionParams = tcsSendRawTx.createSubCasesParams(server, account1, account2, currency,
                txFunction, successCount, failRawTxs, framework.createSubCases)
            let executeFunc = tcsSendRawTx.executeForPerformanceBySendRawTxs
            let checkFunc = function(testCase){}
            // let checkFunc = tcsSendRawTx.checkForSendRawTxs
            for(let i = 0; i < testRound; i++){
                let index = i % serverCount
                let runServer = allServers[index]
                testCase = framework.createTestCaseForSubCases(runServer, title, executeFunc, checkFunc,
                    caseRestrictedLevel, subCaseFunctionParams)
                testCases = []
                framework.addTestScript(testCases, testCase)
                framework.testTestScripts(runServer, describeTitle + "_" + (i + 1), testCases)
            }
        }

        // framework.testTestScripts(server, describeTitle, testCases)
    },

    executeForPerformanceBySendRawTxs: async function(testCase){
        await tcsSendRawTx.executeForSendRawTxs(testCase)
        await utility.timeout(6000)
        //reset sequence of from account
        for(let i = 0; i < testCase.otherParams.subCases.length; i++){
            let from = testCase.otherParams.subCases[i].from
            let sequence = await framework.getSequenceByChain(testCase.server, from)
            framework.setSequence(testCase.server.getName(), from, sequence)
            logger.info("===Current chain sequence: " + sequence)
        }
    },

    createSubCasesParams: function(server, account1, account2, currency, txFunction, successCount, failRawTxs, createSubCasesFunction){
        let subCaseFunctionParams = framework.createSubCasesParams(server, account1, account2, currency, txFunction, createSubCasesFunction)
        subCaseFunctionParams.successCount = successCount
        subCaseFunctionParams.failRawTxs = failRawTxs
        return subCaseFunctionParams
    },

    executeForSendRawTxs: async function(testCase){
        let subCaseFunctionParamsList = testCase.otherParams.subCaseFunctionParamsList
        let totalCount = 0
        testCase.otherParams.servers = [testCase.server]
        testCase.otherParams.subCases = []
        for(let i = 0; i < subCaseFunctionParamsList.length; i++){
            let subCaseFunctionParams = subCaseFunctionParamsList[i]
            let createSubCasesFunction = subCaseFunctionParams.createSubCasesFunction
            let subCases = await createSubCasesFunction(subCaseFunctionParams.server, subCaseFunctionParams.account1,
                subCaseFunctionParams.account2, subCaseFunctionParams.currency,
                subCaseFunctionParams.txFunction, subCaseFunctionParams.successCount)
            for (let subCase of subCases){
                totalCount += subCase.count
            }
            testCase.otherParams.subCases = testCase.otherParams.subCases.concat(subCases)
        }
        testCase.otherParams.totalCount = totalCount

        testCase.otherParams.executeBothSignAndSend = false
        await framework.executeSubCases(testCase)

        let signedTxs = []
        //create success raw tx
        for(let i = 0; i < testCase.otherParams.subCases.length; i++){
            let subCase = testCase.otherParams.subCases[i]
            for(let j = 0; j < (subCase.results ? subCase.results.length : 0); j++){
                signedTxs.push(testCase.otherParams.subCases[i].results[j].result[0].result)
            }
        }

        //create fail raw tx
        let failRawTxs = testCase.otherParams.subCaseFunctionParamsList[0].failRawTxs
        if(failRawTxs && failRawTxs.length > 0){
            for(let i = 0; i < failRawTxs.length; i++){
                signedTxs.push(failRawTxs[i].tx)
            }
        }
        testCase.otherParams.signedTxs = signedTxs

        let result = await testCase.server.getResponse(testCase.server, consts.rpcFunctions.sendRawTx, signedTxs)
        testCase.otherParams.sendRawTxResult = result
    },

    checkForSendRawTxs: async function(testCase){
        let successCount = testCase.otherParams.subCaseFunctionParamsList[0].successCount
        let failRawTxs = testCase.otherParams.subCaseFunctionParamsList[0].failRawTxs
        let failCount = failRawTxs.length
        let response = testCase.otherParams.sendRawTxResult

        if(framework.NEED_CHECK_ExpectedResult && failCount > 0){
            let expectedStatus = failRawTxs[0].code
            let expectedMessage = failRawTxs[0].message
            expect(response.status).to.be.equal(expectedStatus)
            framework.checkResponseError(testCase, response.message, expectedMessage)
        }

        if(successCount > 0){
            let results = response.result
            expect(results.length).to.be.equal(successCount)
            let from = testCase.otherParams.subCases[0].from
            let to = testCase.otherParams.subCases[0].to
            let value = testCase.otherParams.subCases[0].value
            for(let i = 0; i < successCount; i++){
                let hash = results[i].result
                let response = await utility.getTxByHash(testCase.server, hash, 0)
                // expect(response.status).to.be.equal(140)
                let tx = response.result
                expect(tx.Account).to.be.equal(from)
                expect(tx.Destination).to.be.equal(to)
                // expect(value).to.be.equal(tx.Amount)
            }
        }
    },

    //endregion

}
