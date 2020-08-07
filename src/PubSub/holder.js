const assert = require("assert");
const match=require('../MatchPattern').greedyMatch;
module.exports=()=>{
    let cache = [];
    const sanityCheck=(id,pattern,observer)=>{
        return id!=null &&
               pattern!=null &&
               typeof(observer)==='function';
    }
    
    function add(id, pattern, observer) {
        if(sanityCheck(id,pattern,observer) === false )return;
        cache.push({ id, pattern, observer });
    }
  
    function remove(id) {
        if(id==null) return;
        cache = cache.filter(c => c.id!==id);
    }
    
    const candidateSanityCheck=(candidate)=>{
        return candidate!=null &&
               (Array.isArray(candidate)?candidate.length>0:true)&&
               (candidate instanceof Object?Object.keys(candidate).length>0:true);
    }

    function trigger(candidate){
        if(candidateSanityCheck(candidate)===false) return;
        cache.filter(obj=>match(candidate,obj.pattern)).forEach(obj=>obj.observer(candidate));
    }

    
    return {add,remove,trigger};
    
}
