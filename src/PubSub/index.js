
const {match}=require('tcompare');
const assert = require('assert');
module.exports=()=>{
    let cache = [];
  
    const sanityCheck=(pattern,observer)=>{
        assert.ok(typeof(pattern)!=='undefined');
        assert.ok(typeof(observer)==='function');
    }

    function add(msg, observer) {
        sanityCheck(msg,observer);
        cache.push({ msg, observer });
    }
  
    function remove(msg, observer) {
      sanityCheck(msg,observer);
      cache = cache.filter(
        pattern => !(pattern.msg === msg && pattern.observer === observer)
      );
    }

    const publish=(pattern)=>{
        cache.filter(obj=>match(pattern,obj.msg).match).forEach(obj=>obj.observer(pattern));
    }
    const unsubscribe=(pattern,observer)=>{
        remove(pattern,observer);
    }
    const subscribe=(pattern,observer)=>{
        add(pattern,observer);
        return ()=>unsubscribe(pattern,observer);
    }
    return {publish,subscribe,unsubscribe};
}
