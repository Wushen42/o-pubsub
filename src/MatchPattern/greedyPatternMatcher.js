const greedyMatch=(candidate,pattern)=>{
    if(Object.keys(pattern).length===0) return true;
    //if(candidate == null) return false; //default case for deep searching, should not be called because of trigger's assert.
    if(typeof candidate==='string') return handleString(candidate,pattern);
    if(typeof candidate ==='number') return handleNumber(candidate,pattern);
    if(typeof candidate!==typeof pattern){
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
        if(key==='*') return Object.values(candidate).filter(v=>greedyMatch(v,pattern[key])).length>0;
        if(key==='**') return handleWildPath(candidate,pattern[key]);
        return greedyMatch(candidate[key],pattern[key]);
    }).length>0;
}
const handleWildPath=(candidate,pattern)=>{
    const gm=greedyMatch(candidate,pattern);
    return Object.keys(candidate).filter(k=>{           
        if (candidate[k] instanceof Object) return handleWildPath(candidate[k],pattern);
        return greedyMatch(candidate[k],pattern);
    }).length>0||gm;
}

module.exports=greedyMatch;