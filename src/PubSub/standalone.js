
const UUID=require("./UUID");
const Holder = require("./holder");
module.exports=(opts)=>{
    
    const {add,remove,trigger}=Holder(opts);

    const publish=trigger;
    const unsubscribe=(id)=>{
        remove(id);
    };
    const subscribe=(pattern,observer)=>{
        const id=UUID();
        add(id,pattern,observer);
        return ()=>unsubscribe(id);
    };
    return {publish,subscribe};
};


