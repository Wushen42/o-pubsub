var express = require('express')
var app = express();
const Holder = require('./holder');

module.exports = (opts)=>{
    const {add,remove,trigger}=Holder();
    let connections={};
    app.use(express.json());
    app.get('/', function (req, res) {
        res.send('o-pubsub is online');
    });
    app.post('/',(req,res)=>{
        trigger(req.body);
        res.status(200).send('published');
    });
    app.put('/',(req,res)=>{
        const id=req.body.id;
        const unsubscribe=()=>{
            remove(id);
        }
        res.on("error",()=>{
            unsubscribe();
        }
        ).on("close",()=>{
            unsubscribe();
        });
        connections[id]={ id, res};
        add(
                req.body.id,
                req.body.pattern,
                data=>{res.write(JSON.stringify(data))}
            
        );
    });
    app.delete('/:id',(req,res)=>{
        const id=req.params.id;
        const cpy=connections;
        cpy[id]?.res?.destroy();
        delete cpy[id];
        connections=cpy;
        remove(id);
        res.status(200).send();
    });
    return app;
}