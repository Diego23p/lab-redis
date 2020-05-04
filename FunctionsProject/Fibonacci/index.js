const bigInt = require("big-integer");
const redis = require("redis");
const bluebird = require("bluebird");

//promesificar todas las funciones
bluebird.promisifyAll(redis);

//conectar a base de datos
/*
const client = redis.createClient(
    {
        host: 'localhost',
        port: '6379'
    }
);*/

const client = redis.createClient(
    6380,'redis-experiment.redis.cache.windows.net',
    {
        auth_pass: 'YxAZE1qRfYSA0yzJOuwJzgkvDwx8Ojg0qCOVL4v08U4=',
        tls:{
            servername: 'redis-experiment.redis.cache.windows.net'
        }
    }
);


async function fibonacciExists(nth){
    let key = generateKey(nth);
    await client.existsAsync(key) === 1;
}

async function getFibonacci(nth) {
    let key = generateKey(nth);
    await client.getAsync(key);
}

async function setFibonacci(nth, nthValue){
    let key = generateKey(nth);
    await client.setAsync(key, nthValue.toString());
}

function generateKey(nth){
    return `fibonacci:nth:${nth.toString()}`;
}

async function fibonacci(nth){
    var rta = null;
    if(nth==1 || nth==2){
        rta =  bigInt.one;
    }else if(await fibonacciExists(nth)){
        return (await getFibonacci(nth));
    }
    else{
        rta = (await fibonacci(nth-1)).add((await fibonacci(nth-2)));
        await setFibonacci(nth, rta);
    }
    return rta;
}

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let nth = req.body.nth;
    let answer = await fibonacci(nth);

    context.res = {
        body: answer.toString()
    }

};