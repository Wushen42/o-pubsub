const assert = require("assert");
const {match,has}=require('tcompare');
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
        cache.filter(obj=>greedyMatch(candidate,obj.pattern)).forEach(obj=>obj.observer(candidate));
    }

    const greedyMatch=(candidate,pattern)=>{
        if(Object.keys(pattern).length===0) return true;
        if(candidate == null) return true; //default case for deep searching, should not be called because of trigger's assert.
        if(typeof candidate==='string') return handleString(candidate,pattern);
        if(typeof candidate ==='number') return handleNumber(candidate,pattern);
        if(typeof candidate!==typeof pattern){
            console.log('type mismatch, maybe unhandled');
            return false;
        }
        
        if(candidate instanceof RegExp) return handleRegExp(candidate,pattern);
        if(pattern instanceof RegExp) return handleRegExp(pattern,candidate);
        if(Array.isArray(candidate)) return handleArray(candidate,pattern);
        if(candidate instanceof Object) return handleObject(candidate,pattern);
        console.log('this case is not implemented yet');
        return false;
    }
    const handleString=(candidate,pattern)=>{
        if(pattern instanceof RegExp) return handleRegExp(pattern,candidate);
        return candidate===pattern;
    }
    const handleNumber=(candidate, pattern)=>{
        return candidate===pattern;
    }
    const handleArray=(candidate, pattern)=>{
        if(! Array.isArray(pattern)) return false;
        return candidate.length===pattern.length;
    }
    const handleRegExp=(regex,pattern)=>{
        return pattern.toString().match(regex);
    }
    const handleObject=(candidate,pattern)=>{
       return Object.keys(pattern).filter(key=>{

            return greedyMatch(candidate[key],pattern[key]);
        }).length>0;
    }

    return {add,remove,trigger};
    
}
