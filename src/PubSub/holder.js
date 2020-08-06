const assert = require("assert");
const {match}=require('tcompare');
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
    
    function addId(id,msg, observer) {
        assert.ok(typeof(id)!=='undefined');
        sanityCheck(msg,observer);
        cache.push({id, msg, observer });
    }
    function removeById(id){
        assert.ok(typeof(id)!=='undefined');
        cache = cache.filter(c => !(c.id===id));
    }
    function trigger(pattern){
        cache.filter(obj=>match(pattern,obj.msg).match).forEach(obj=>obj.observer(pattern));
    }
    return {add,addId,remove,removeById,trigger};
    
}
