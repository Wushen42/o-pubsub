
const UUID=require('./UUID');
const assert = require('assert');
const Holder = require('./holder');
module.exports=()=>{
    
    const {add,remove,trigger}=Holder();

    const publish=trigger;
    const unsubscribe=(id)=>{
        remove(id);
    }
    const subscribe=(pattern,observer)=>{
        const id=UUID();
        add(id,pattern,observer);
        return ()=>unsubscribe(id);
    }
    return {publish,subscribe};
}


