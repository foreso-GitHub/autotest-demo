const WebSocket = require('ws');

let ws_count = 0
let open_count = 0
let message_count = 0
let close_count = 0

run()

//region v1
function run_1(){
    let count = 0
    for(let i = 1; i <= 1000; i++){
        let address = 'ws://121.89.209.19:9546/v1/jsonrpc'
        let content = '{"jsonrpc":"2.0","method":"jt_blockNumber","params":[],"id":1}'
        // let response = await
        request_1(address, content, function(data){
            console.log(i + "response1: " + JSON.stringify(data))
            count++
            // if(count == 200){
            //     console.log('count: ' + count)
            // }
            // console.log('count: ' + count)
        })

        content = '{\n' +
            '    "jsonrpc": "2.0",\n' +
            '    "method": "jt_getBlockByNumber",\n' +
            '    "params": [\n' +
            '        "1131",\n' +
            '        false\n' +
            '    ],\n' +
            '    "id": 2\n' +
            '}'
        request_1(address, content, function(data){
            console.log(i + "response2: " + JSON.stringify(data))
            count++
            // if(count == 200){
            //     console.log('count: ' + count)
            // }
            // console.log('count: ' + count)
        })
    }
}

function request_1(address, content, callback){
    if(ws_count < 100){
        console.log('request_1: ' + ws_count)
        req_1(address, content, callback)
    }
    else{
        setTimeout(
            () => {
                request_1(address, content, callback)
            }, 10)
    }
}

function req_1(address, content, callback){

    const ws = new WebSocket(address)

    ws.on('open', function open() {
        // console.log('open');
        ws.send(content);

        ws_count++
        open_count++
        console.log('open count: ' + ws_count + '/' + open_count)
    });

    ws.on('message', function incoming(data) {
        let result = JSON.parse(data)
        // console.log('message:' + result.id);
        // console.log(data);
        callback(result)
        message_count++
        console.log('message count: ' + ws_count + '/' + message_count)
        ws.close()
    })

    ws.on('close', function close() {
        // console.log('disconnected');
        ws_count--
        close_count++
        console.log('close count: ' + ws_count + '/' + close_count)
    });
}
//endregion

//region v2
async function run(){
    let count = 0
    for(let i = 1; i <= 1; i++){
        let address = 'ws://121.89.209.19:9546/v1/jsonrpc'
        let content = '{"jsonrpc":"2.0","method":"jt_blockNumber","params":[],"id":1}'
        // let response = await request(address, content)
        // console.log(i++ + ". response1: " + JSON.stringify(response))

        // content = '{"id":0,"method":"jt_subscribe","params":["block"]}'
        // content = '{"id":0,"method":"jt_subscribe","params":["tx"]}'
        content = '{"id":0,"method":"jt_subscribe","params":["account", "jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh"]}'
        // content = '{"id":0,"method":"jt_subscribe","params":["token", "TSC_2"]}'
        // response = await request(address, content)
        let output = {}
        // response = await request2(address, content, checkBlock, output)
        // console.log(i++ + ". response2: " + JSON.stringify(response))
        // console.log(i++ + ". output: " + JSON.stringify(output))

        const ws = new WebSocket(address)
        // content = '{"id":0,"method":"jt_subscribe","params":["block"]}'
        // response = request3(ws, content)

        // content = '{"id":0,"method":"jt_subscribe","params":["tx"]}'
        // response = request3(ws, content)
        //
        // content = '{"id":1,"method":"jt_subscribe","params":["tx"]}'
        // response = request3(ws, content)

        content = '{"id":0,"method":"jt_subscribe","params":["block"]}'
        response = request3(ws, content)

        content = '{"id":1,"method":"jt_subscribe","params":["block"]}'
        response = request3(ws, content)

        content = '{"id":2,"method":"jt_unsubscribe","params":["block", 1]}'
        response = request3(ws, content)

        // content = '{"id":2,"method":"jt_unsubscribe","params":["block", 3]}'
        // response = request3(ws, content)

        // count++
        // console.log(". count: " + count)
    }
}

function checkBlock(data, output){
    if(!output.blocks) output.blocks = []
    output.blocks.push(data)
}

function request2(address, content, func, output){
    let no = 0
    return new Promise((resolve, reject)=>{
        const ws = new WebSocket(address)

        ws.on('open', function open() {
            // console.log('open')
            ws.send(content);
            setTimeout(
                () => {
                    ws.close()
                    resolve("done!")
                }, 20000)
            ws_count++
            console.log('open count: ' + ws_count)
        })

        ws.on('message', function incoming(data) {
            let result = JSON.parse(data)
            console.log(no++ + '. message:' + data)
            func(result, output)
            // resolve(result)
            // ws.close()
        })

        ws.on('close', function close() {
            // console.log('disconnected')
            ws_count--
            console.log('close count: ' + ws_count)
        })
    })

}

function request3(ws, content){
    let no = 0
    return new Promise((resolve, reject)=>{

        ws.on('open', function open() {
            // console.log('open')
            ws.send(content)
            // setTimeout(
            //     () => {
            //         ws.close()
            //     }, 20000)
            ws_count++
            console.log('open count: ' + ws_count)
        })

        ws.on('message', function incoming(data) {
            let result = JSON.parse(data)
            console.log(no++ + '. message:' + data)
            // if(result.result != 'done'){
            //     ws.send('{"id":1,"method":"jt_unsubscribe","params":["block", 0]}')
            // }
            // resolve(result)

            // ws.close()
        })

        ws.on('close', function close() {
            // console.log('disconnected')
            ws_count--
            console.log('close count: ' + ws_count)
        })
    })

}

function request(address, content){
    let no = 0
    return new Promise((resolve, reject)=>{
        const ws = new WebSocket(address)

        ws.on('open', function open() {
            // console.log('open')
            ws.send(content);
            // setTimeout(
            //     () => {
            //         ws.close()
            //     }, 20000)
            ws_count++
            console.log('open count: ' + ws_count)
        })

        ws.on('message', function incoming(data) {
            let result = JSON.parse(data)
            console.log(no++ + '. message:' + data)
            resolve(result)
            // ws.close()
        })

        ws.on('close', function close() {
            // console.log('disconnected')
            ws_count--
            console.log('close count: ' + ws_count)
        })
    })

}

//endregion