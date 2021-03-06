//region require
let log4js = require('log4js')
log4js.configure('./log4js.json')
let logger = log4js.getLogger('default')
const nodeMonitor = require('./monitor')
let monitor = new nodeMonitor()
let sshCmd = require('../../framework/sshCmd')
let utility = require("../../framework/testUtility.js")
const { jtNodes, } = require("../../config/config")
//endregion

//region set services
let services = jtNodes

// let jt_node_bd = jtNodes[0]
// let jt_node_tx = jtNodes[1]
// let jt_node_hw = jtNodes[2]
// let jt_node_ty = jtNodes[3]
// let jt_node_al = jtNodes[4]
//endregion

//region set cmd
const cmd_start_jt = 'sudo /root/start.sh'
const cmd_stop_jt = 'sudo /root/stop.sh'
//endregion

module.exports = nodeStatusTool = {
    //region functions

    test: async function(){
        let netSync = await monitor.checkSync(services)
        monitor.printNetSync(netSync)

        nodeStatusTool.stopJt(jt_node_bd)
        await utility.timeout(10000)
        netSync = await monitor.checkSync(services)
        monitor.printNetSync(netSync)

        nodeStatusTool.startJt(jt_node_bd)
        await utility.timeout(60000)
        netSync = await monitor.checkSync(services)
        monitor.printNetSync(netSync)
    },

    testMonitor: async function(){
        let netSync = await monitor.checkSync(services)
        monitor.printNetSync(netSync)
    },

    testSshCmd: function(){
        let services = []
        services.push(sshCmd.setCmd(jt_node_al, 'echo hello ali'))
        services.push(sshCmd.setCmd(jt_node_bd, cmd_stop_jt))

        sshCmd.execCmd(servers, function(error, results){
            results.forEach(result=>{
                logger.debug('service name:' + result.service.name)
                logger.debug('cmd result:' + result.cmdResult)
            })
        })
    },

    resetNodes: async function(){
        for(let i = 0; i < jtNodes.length; i++){
            nodeStatusTool.stopJt(jtNodes[i])
        }

        await utility.timeout(5000)

        for(let i = 0; i < jtNodes.length; i++){
            nodeStatusTool.startJt(jtNodes[i])
        }
    },

    stopNodes: function(){
        for(let i = 0; i < jtNodes.length; i++){
            nodeStatusTool.stopJt(jtNodes[i])
        }
    },

    startNodes: function(){
        for(let i = 0; i < jtNodes.length; i++){
            nodeStatusTool.startJt(jtNodes[i])
        }
    },

    resetNode: async function(name){
        let service = nodeStatusTool.getNode(name, jtNodes)
        nodeStatusTool.stopJt(service)
        await utility.timeout(5000)
        nodeStatusTool.startJt(service)
    },

    startJt: function(service){
        let servers = []
        servers.push(sshCmd.setCmd(service, service.cmds.start))
        sshCmd.execCmd(servers, function(error, results){
            results.forEach(result=>{
                logger.debug('service name:' + result.service.name)
                logger.debug('cmd result:' + result.cmdResult)
            })
        })
    },

    stopJt: function(service){
        let servers = []
        servers.push(sshCmd.setCmd(service, service.cmds.stop))
        sshCmd.execCmd(servers, function(error, results){
            results.forEach(result=>{
                logger.debug('service name:' + result.service.name)
                logger.debug('cmd result:' + result.cmdResult)
            })
        })
    },

    getNode: function(name, services){
        let service = null
        for(let i = 0; i < services.length; i++){
            if(services[i].name == name){
                service = services[i]
                break;
            }
        }
        return service
    },

    //endregion
}

