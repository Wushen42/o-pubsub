const assert = require("assert");
const PubSubServer= require("./index").restServer();
const PubSub = require("./index").restClient;

const async = (fn, delay) => {
  setTimeout(fn, delay || 0);
};
describe("PubSub:Rest", () => {
    it("handle pubsub",done=>{
       
        const pubsub = PubSub();
        const dataReceived=[];
        
        const msg={hello:"there"};
        const expected=[msg];
        const next = ()=>{
            const unsub=pubsub.subscribe({hello:"there"},data=>{dataReceived.push(data);});
            pubsub.publish(msg);
            unsub();
            pubsub.publish(msg);
            async(()=>{
                assert.deepEqual(dataReceived,expected);

                server.close(done);
            },250);
        };
        const server = PubSubServer.listen(3000,next);
    });
 
});
