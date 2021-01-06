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
const chainDatas = require('../testData/chainDatas').chainDatas
const testUtility = require('../framework/testUtility')
//endregion
//endregion

module.exports = tcsGetBalance = {

    //注意：一般而言，初始化使用baidu节点的rpc接口，因此初始化时的nickname只存在于baidu节点。因此getBalance检查nickname的case只有在baidu节点才能通过。

//region balance check

    testForGetBalance: function(server, describeTitle){
        describe(describeTitle, function () {
            let symbol = null //swtc
            tcsGetBalance.testForGetBalanceByAllTags(server, symbol)
            if(server.mode.service == serviceType.newChain){
                symbol = server.mode.coins[0].symbol   //token with issuer
                tcsGetBalance.testForGetBalanceByAllTags(server, symbol, null)
                symbol = server.mode.coins[1].symbol   //token without issuer
                let issuer = server.mode.coins[1].issuer
                tcsGetBalance.testForGetBalanceByAllTags(server, symbol, issuer)
            }
        })
    },

    testForGetBalanceByAllTags: function(server, symbol, issuer){
        tcsGetBalance.testForGetBalanceBySymbolAndTag(server, symbol, issuer, null)
        tcsGetBalance.testForGetBalanceBySymbolAndTag(server, symbol, issuer, consts.tags.current)
        tcsGetBalance.testForGetBalanceBySymbolAndTag(server, symbol, issuer, consts.tags.validated)

        //todo need restore when these tags are supported.
        // tcsGetBalance.testForGetBalanceBySymbolAndTag(server, symbol, issuer, 'earliest')
        // tcsGetBalance.testForGetBalanceBySymbolAndTag(server, symbol, issuer, 'latest')
        // tcsGetBalance.testForGetBalanceBySymbolAndTag(server, symbol, issuer, 'pending')
        // let chainData = testUtility.findItem(chainDatas, server.mode.chainDataName, function(chainData){
        //     return chainData.chainDataName
        // })
        // tcsGetBalance.testForGetBalanceBySymbolAndTag(server, symbol, issuer, chainData.block.blockNumber)  //block number
        // tcsGetBalance.testForGetBalanceBySymbolAndTag(server, symbol, issuer, chainData.block.blockHash)  //block hash
    },

    testForGetBalanceBySymbolAndTag: function(server, symbol, issuer, tag){

        let testCases = []
        let showSymbol = symbol == null ? 'swtc' : symbol
        let describeTitle = '测试jt_getBalance， Token为' + showSymbol + '，tag为' + tag

        let title = '0010\t查询有效的地址_01:地址内有底层币和代币'
        let addressOrName = server.mode.addresses.balanceAccount.address
        let needPass = true
        let expectedError = ''
        let testCase = tcsGetBalance.createSingleTestCaseForGetBalance(server, title, addressOrName, symbol, issuer, tag, needPass, expectedError)
        if(tag == null) testCase.supportedServices.push(serviceType.oldChain)
        framework.addTestScript(testCases, testCase)

        title = '0010\t查询有效的昵称_01:地址内有底层币和代币'
        addressOrName = server.mode.addresses.balanceAccount.nickName
        testCase = tcsGetBalance.createSingleTestCaseForGetBalance(server, title, addressOrName, symbol, issuer, tag, needPass, expectedError)
        framework.addTestScript(testCases, testCase)

        title = '0010\t查询未激活的地址_01:地址内没有有底层币和代币'
        addressOrName = server.mode.addresses.inactiveAccount1.address
        needPass = false
        expectedError = framework.getError(-96, tag == consts.tags.current ? 'no such account info' : 't find account' )
        testCase = tcsGetBalance.createSingleTestCaseForGetBalance(server, title, addressOrName, symbol, issuer, tag, needPass, expectedError)
        if(tag == null) testCase.supportedServices.push(serviceType.oldChain)
        framework.addTestScript(testCases, testCase)

        title = '0010\t查询未激活的昵称_01:地址内没有有底层币和代币'
        addressOrName = server.mode.addresses.inactiveAccount1.nickName
        expectedError =framework.getError(-96, 'Bad account address')
        testCase = tcsGetBalance.createSingleTestCaseForGetBalance(server, title, addressOrName, symbol, issuer, tag, needPass, expectedError)
        framework.addTestScript(testCases, testCase)

        title = '0010\t查询无效的地址_01:地址内没有有底层币和代币'
        addressOrName = server.mode.addresses.wrongFormatAccount1.address
        expectedError = framework.getError(-96, 'Bad account address')
        testCase = tcsGetBalance.createSingleTestCaseForGetBalance(server, title, addressOrName, symbol, issuer, tag, needPass, expectedError)
        if(tag == null) testCase.supportedServices.push(serviceType.oldChain)
        framework.addTestScript(testCases, testCase)

        title = '0010\t查询无效的昵称_01:地址内没有有底层币和代币'
        addressOrName = server.mode.addresses.wrongFormatAccount1.nickName
        expectedError = framework.getError(-96, 'Bad account address')
        testCase = tcsGetBalance.createSingleTestCaseForGetBalance(server, title, addressOrName, symbol, issuer, tag, needPass, expectedError)
        framework.addTestScript(testCases, testCase)

        framework.testTestScripts(server, describeTitle, testCases)
    },

    createSingleTestCaseForGetBalance: function(server, title, addressOrName, symbol, issuer, tag, needPass, expectedError){

        let functionName = consts.rpcFunctions.getBalance
        let txParams = []
        txParams.push(addressOrName)
        if(symbol != null) txParams.push(symbol)
        if(issuer != null) txParams.push(issuer)
        if(tag != null) {
            if(symbol == null){
                txParams.push(consts.default.nativeCoin)  //使用tag，必须要有token
            }
            if(issuer == null){
                txParams.push(consts.default.issuer)  //使用tag，必须要有issuer
            }
            txParams.push(tag)
        }
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
            framework.executeTestCaseForGet,
            tcsGetBalance.checkGetBalance,
            expectedResult,
            restrictedLevel.L2,
            [serviceType.newChain,],
            [],//[interfaceType.rpc,],//[interfaceType.rpc, interfaceType.websocket]
        )

        return testCase
    },

    checkGetBalance: function(testCase){
        let response = testCase.actualResult[0]
        let needPass = testCase.expectedResult.needPass
        framework.checkResponse(needPass, response)
        if(needPass){
            expect(response.result).to.be.jsonSchema(schema.BALANCE_SCHEMA)
            expect(Number(response.result.balance.value)).to.be.above(0)
        }
        else{
            framework.checkResponseError(testCase, response)
        }
    },

//endregion

}
