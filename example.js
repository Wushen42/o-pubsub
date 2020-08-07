const OPubSub = require('./index');
const PubSubServer =OPubSub.restServer();//import the server without options
const PubSub=OPubSub.restClient;// import a pub sub Client

const next=()=>{
  const {publish,subscribe} = PubSub();//create a pubsub module without parameters gives an example one
  const unsubscribe=subscribe({hello:'there'},(data)=> console.log(data));//will log {hello:'there',meaning:{of:{life:42}}} only once
  publish({hello:'there',meaning:{of:{life:42}}});
  publish({hello:'you',meaning:{of:{life:42}}});
  unsubscribe();
  publish({hello:'there',meaning:{of:{life:42}}});
}

const server = PubSubServer.listen(3000,next);