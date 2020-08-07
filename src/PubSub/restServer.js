var express = require('express')
var app = express();
const Holder = require('./holder');

module.exports = (opts)=>{
    
    const {add,remove,trigger}=Holder();
    app.use(express.json());
    app.get('/', function (req, res) {
        res.send('o-pubsub is online');
    });
    app.post('/',(req,res)=>{
        trigger(req.body);
        res.status(200).send('published');
    });
    app.put('/',(req,res)=>{
        let unsubscribe=()=>{
            res.write('not subscribed yet');
        }
        res.on("error",()=>{
            unsubscribe();
        }
        ).on("close",()=>{
            unsubscribe();
        })
        console.log(req.body);
        add(
                req.body.id,
                req.body.pattern,
                data=>{res.write(JSON.stringify(data))}
            
        );
    });
    app.delete('/:id',(req,res)=>{
        const id=req.params.id
        console.log('received id to delete' ,id);
        remove(id);
        res.status(200).send();
    })
    return app.listen(3000);
}