# o-pubsub
Object matching publish/subscribe pattern

Why bother defining routes and topics when you can subscribe to data?

Easy to use pubsub mechanism using objects instead of strings 

as a standalone
```javascript
const PubSub=require('o-pubsub').standalone;// import a standalone pub sub
const {publish,subscribe} = PubSub();//create a pubsub module

const unsubscribe=subscribe({hello:'there'},(data)=> console.log(data));//will log {hello:'there',meaning:{of:{life:42}}} only once
publish({hello:'there',meaning:{of:{life:42}}});
publish({hello:'you',meaning:{of:{life:42}}});
unsubscribe();
publish({hello:'there',meaning:{of:{life:42}}});
```
or as a web service

```javascript
const OPubSub = require('o-pubsub');
const PubSubServer =OPubSub.restServer();//import the server without options
const PubSub=OPubsub.restClient;// import a pub sub Client

const next=()=>{
  const {publish,subscribe} = PubSub();//create a pubsub module without parameters gives an example one
  const unsubscribe=subscribe({hello:'there'},(data)=> console.log(data));//will log {hello:'there',meaning:{of:{life:42}}} only once
  publish({hello:'there',meaning:{of:{life:42}}});
  publish({hello:'you',meaning:{of:{life:42}}});
  unsubscribe();
  publish({hello:'there',meaning:{of:{life:42}}});
}

const server = PubSubServer.listen(3000,next);

```

wildcards '*' and wild path '**' are implemented on subscriptions 
```javascript

const testWildPath=()=>{
  const pubSub = require('o-pubsub').standalone();
    let results = [];
    const msg = { '*': {floor2:{floor3:'hello'}} };
    const msg2 = { floor1: {'*':{floor3:'hello'}} };
    const msg3 = { '*': {floor2:{'*':'hello'}} };
    const msg4 = { '*': {'*':{'*':'hello'}} };
    const errmsg = {'*':'hello'};
    pubSub.subscribe(msg, data => {
      results.push(data);
    });
    pubSub.subscribe(msg2, data => {
      results.push(data);
    });
    pubSub.subscribe(msg3, data => {
      results.push(data);
    });
    pubSub.subscribe(msg4, data => {
      results.push(data);
    });
    pubSub.subscribe(errmsg, data => {
      results.push(data);
    });
    pubSub.publish({floor1:{floor2:{floor3:'hello'}}});

    setTimeout(() => {
      console.log(results);// [{floor1:{floor2:{floor3:'hello'}}},{floor1:{floor2:{floor3:'hello'}}},{floor1:{floor2:{floor3:'hello'}}},{floor1:{floor2:{floor3:'hello'}}}];
    }, 10);
}

const testwildpath=()=>{
    const pubSub = require('o-pubsub').standalone();
    const msg = { '**':'hello'};
    const errMsg = { '**':'NOPE'};
    pubSub.subscribe(msg, console.log); //{floor1:{floor2:{floor3:'hello'}}}
    pubSub.subscribe(errMsg, data => {
      throw new Error('Should not be invoked');
    });
    
    pubSub.publish({floor1:{floor2:{floor3:'hello'}}});
}
```

### Constructors
|Name|Comment|Options|
| ------------- | ------------- | ------------- |
|standalone({options})| returns publish and subscribe methods| options:{<br> matcher:(candidate,pattern)=>return boolean<br>}|
|restServer({options})| returns Express.js server| options:{<br> matcher:(candidate,pattern)=>return boolean<br>}|
|restClient({options}) |returns publish and subscribe methods, options are http requests one.| default{<br> hostname: 'localhost',<br>    port: 3000,<br>    path: '/o-pubsub/',<br>    method: 'GET',<br>    headers: {<br>      'Content-Type': 'application/json'<br>    }<br>}|

Create your own matcher and pass it as a parameters, candidate and pattern can be anything.

### Methods
|Name | Comment|
| ------------- | ------------- |
|publish(data)| send data to every pattern subscribers.|
|unsubscribe=subscribe(pattern,callback)| subscribe to the pattern, return the unsubscribe method. as it's a FireAndForget, ensure to store this method.|
|unsubscribe()|unsubscribe to pattern.|

### API

restClient is a wrapper for restServer but you could implement it on your own:

| Name | Comment |
| --------------------------- | ------------- |
| get('/o-pubsub/') | returns 'o-pubsub is online'.|
| post('/o-pubsub/') | will publish req.body.|
| put('/o-pubsub/:id') | will subscribe to req.body, ensure to store id for unsubscription.|
| delete('/o-pubsub/:id') | unsubscribe to pattern registered with given id.|

publish and subscribe accept Object,number,regexp,string,Array 
note: on array the comparison is made first on type then on length, not on data inside.
