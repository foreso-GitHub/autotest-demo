//region require
let log4js = require('log4js')
log4js.configure('./log4js.json')
let logger = log4js.getLogger('default')
const { allModes } = require("../../config/config")
const utility = require("../../framework/testUtility.js")
//endregion

// let mode = allModes[0]
// let server = mode.server
// server.init(mode)

// initTestDataForSwtclib()

// chargeMain(
//     'j9t5tjAawNoAxgn7FudkaKTo7GjD3HqvtH',
//     '',
//     '',
//     30,
//     null,
//     0)

function charger() {

    charger.prototype.chargeBasedOnBalance = function(server, sender, accounts, checkBalance, chargeAmount){
        return new Promise((resolve, reject) => {
            let accountsNeedBeCharged = []
            let totalCount = accounts.length
            let count = 0
            accounts.forEach(async (account) => {
                let balanceObject = await server.getBalance(server, account.address)

                if(!balanceObject
                    || !balanceObject.value
                    || balanceObject && balanceObject.value && balanceObject.value < checkBalance){
                    accountsNeedBeCharged.push(account)
                }
                count++
                if(count == totalCount){
                    await this.chargeAccounts(server, sender, accountsNeedBeCharged, chargeAmount)
                    resolve(accountsNeedBeCharged)
                }
            })
        })
    }

    charger.prototype.chargeAccounts = async function(server, sender, accounts, value){
        let root = sender.address
        let rootSecret = sender.secret
        let sequence = await server.getSequence(server, root)
        for(let account of accounts){
            await charge(server, root, rootSecret, account.address, value.toString(), sequence++, 0)
                .then(function(result){logger.debug(JSON.stringify(result))})
        }
    }

    async function charge(server, from, secret, to, value, sequence, waitSpan){
        let params = server.createTxParams(from, secret, sequence, to, value, null, null,
            null, null, null, null, null, null, null)
        return new Promise((resolve, reject) => {
            server.responseSendTx(server, params).then(async function (result) {
                logger.debug(JSON.stringify((result)))
                await utility.timeout(waitSpan)
                resolve({from: from, to: to, value: value, success: true, result: result})
            }).catch(function(error){
                reject({from: from, to: to, value: value, success: false, message: error})
                //return {address: address, value: value, success: false, message: error}
            })
        })
    }

}

module.exports = charger
