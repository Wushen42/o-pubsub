# o-pubsub
Object matching publish/subscribe pattern

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
or as a web service(in progress, at the moment the server listen only on 3000 with http without possible route)

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
publish and subscribe accept Object,number,regexp,string,Array 
note: on array the comparison is made forst on type then on length, not on data inside.
