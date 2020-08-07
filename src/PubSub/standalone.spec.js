const assert = require('assert');
const PubSub = require('./index').standalone;

const async = (fn, delay) => {
  setTimeout(fn, delay || 0);
};

describe('PubSub:Standalone', () => {
  it('handles empty object, null or undefined message', done => {
    const pubSub = PubSub();
    pubSub.subscribe({ hello: 'there' }, () => {
      throw new Error('Should not be invoked with empty messages');
    });
    pubSub.publish(undefined);
    pubSub.publish(null);
    pubSub.publish({});
    pubSub.publish([]);
    async(() => done());
  });

  it('can subscribe to all messages', done => {
    const pubSub = PubSub();
    const msgs = [
      { hello: 'world', hi: 'you' },
      { hi: 'there' },
      { beep: 'boop', tricky: 'neat' }
    ];
    let results = [];
    pubSub.subscribe({}, msg => {
      results.push(msg);
    });
    msgs.forEach(pubSub.publish);
    async(()=>{
      assert.deepEqual(results, msgs);
        done();
    },10);
  });

  it('matches all values of a key with a regex', done => {
    const pubSub = PubSub();
    const msgs = [{ hello: 'world', hi: 'you' }, { hi: 'there' },{hi:['there','you']}];
    let results = [];
    pubSub.subscribe({ hi: /.*/ }, msg => {
      results.push(msg);
      if (results.length === msgs.length) {
        assert.deepEqual(results, msgs);
        done();
      }
    });
    msgs.forEach(pubSub.publish);
    pubSub.publish({ beep: 'boop', tricky: 'neat' });
  });

  it('handles partial matching', done => {
    let received = [];
    const pubSub = PubSub();
    pubSub.subscribe({ friend: 'yes', hello: 'there' }, msg => {
      received.push(msg);
    });

    const message = { some: 'action', hello: 'there', friend: 'yes' };
    pubSub.publish(message);

    async(() => {
      assert.deepEqual(received, [message]);
      done();
    });
  });

  it('subscribes only to desired messages', done => {
    let received = [];
    const pubSub = PubSub();
    const messages = [{ some: 'action' }, { hello: 'there' }];
    messages.forEach(msg => pubSub.subscribe(msg, received.push));
    pubSub.publish({ other: 'thing' });
    pubSub.publish({ something: 'extra' });
    async(() => {
      assert.deepEqual(received, []);
      done();
    });
  });

  it('accepts messages of type Object and Array', done => {
    let received = [];
    const pubSub = PubSub();
    const messages = [{ my: 'value' }, [1, 2, 3]];
    const myHandler = msg => {
      received.push(msg);
    };
    messages.forEach(msg => {
      pubSub.subscribe(msg, myHandler);
      pubSub.publish(msg);
    });
    async(() => {
      assert.deepEqual(received, messages);
      done();
    });
  });

  it('unsubscribe inhibits future messages', done => {
    const pubSub = PubSub();
    let results = [];
    const msg = { beep: 'boop' };
    let unsub = pubSub.subscribe(msg, data => {
      results.push(data);
    });
    unsub();
    pubSub.publish(msg);

    async(() => {
      assert.deepEqual(results, []);
      done();
    }, 10);
  });
  it('handles deep matching', done => {
    const pubSub = PubSub();
    let results = [];
    const msg = { floor1: {floor2:{floor3:'hello'}} };
    const errMsg = { floor1: {floor2:{floor3:'NOPE'}} };
    pubSub.subscribe(msg, data => {
      results.push(data);
    });
    pubSub.subscribe(errMsg, data => {
      throw new Error('Should not be invoked');
    });
    
    pubSub.publish({floor1:{floor2:{floor3:'hello'}}});

    async(() => {
      assert.deepEqual(results, [msg]);
      done();
    }, 10);
  });
  it('handles wildcard key', done => {
    const pubSub = PubSub();
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

    async(() => {
      assert.deepEqual(results, [{floor1:{floor2:{floor3:'hello'}}},{floor1:{floor2:{floor3:'hello'}}},{floor1:{floor2:{floor3:'hello'}}},{floor1:{floor2:{floor3:'hello'}}}]);
      done();
    }, 10);
  });
  it('handles wildpath matching', done => {
    const pubSub = PubSub();
    let results = [];
    const msg = { '**':'hello',hi:'there'};
    const errMsg = { '**':'hello',hi:'you' };
    pubSub.subscribe(msg, data => {
      results.push(data);
    });
    pubSub.subscribe(errMsg, data => {
      throw new Error('Should not be invoked');
    });
    
    pubSub.publish({floor1:{floor2:{floor3:'hello'}},hi:'there'});

    async(() => {
      assert.deepEqual(results, [{floor1:{floor2:{floor3:'hello'}},hi:'there'}]);
      done();
    }, 10);
  });
  it('handles wildpath and deep matching', done => {
    const pubSub = PubSub();
    let results = [];
    const msg = { '**':{hi:'there'}};
    const errMsg = { '**':{hi:'NOPE'}} ;
    pubSub.subscribe(msg, data => {
      results.push(data);
    });
    pubSub.subscribe(errMsg, data => {
      throw new Error('Should not be invoked');
    });
    
    pubSub.publish({floor1:{floor2:{floor3:{hi:'there'}}}});

    async(() => {
      assert.deepEqual(results, [{floor1:{floor2:{floor3:{hi:'there'}}}}]);
      done();
    }, 20);
  });
});
