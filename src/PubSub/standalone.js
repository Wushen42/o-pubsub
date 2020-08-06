

const assert = require('assert');
const Holder = require('./holder');
module.exports=()=>{
    
    const {add,remove,trigger}=Holder();

    const publish=trigger;
    const unsubscribe=(pattern,observer)=>{
        remove(pattern,observer);
    }
    const subscribe=(pattern,observer)=>{
        add(pattern,observer);
        return ()=>unsubscribe(pattern,observer);
    }
    return {publish,subscribe};
}


