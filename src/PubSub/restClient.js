const http=require('http');
const uuid=require('./UUID');
const Path=require('path');
const templateOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }
module.exports = (opts={})=>{
    
    const sanityOptions = {
        ...templateOptions,...opts
    }

    const publish=(pattern)=>{
        if(pattern===null)return ;
        if(pattern===undefined) return ;
        const req = http.request({...sanityOptions,method:'POST'}, (res) => {
            //console.log(`statusCode: ${res.statusCode}`)
          })
          
          req.on('error', (error) => {
            console.error(error)
          })
          console.log('publishing:',pattern,' on port:',sanityOptions.port);
          req.write(JSON.stringify(pattern))
          req.end()
    }
    const subscribe=(pattern,observer)=>{
        
            const req = http.request({...sanityOptions,method:'PUT'}, (res) => {
                res.on('data',(data)=>{
                    try {
                        const json = JSON.parse(data.toString());
                        observer(json);
                      } catch (err) {
                        console.log('unable to parse', data.toString(),err);
                      }
                    });         
            });
            
            req.on('error', (error) => {
              console.error(error)
            })
            const id=uuid();
            req.write(JSON.stringify({id,pattern}));
            req.end();   
            return ()=>unsubscribe(id);
    }
    function unsubscribe(id){
        const req = http.request({...sanityOptions,path:Path.join(sanityOptions.path,id),method:'DELETE'}, (res) => {
            //console.log(`statusCode: ${res.statusCode}`)
          })
          
          req.on('error', (error) => {
            console.error(error)
          })
          
          req.flushHeaders();
          req.end()
    }
    return {publish,subscribe};
}