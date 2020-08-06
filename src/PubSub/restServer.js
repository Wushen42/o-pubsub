var express = require('express')
var app = express();
const Holder = require('./holder');

module.exports = (opts)=>{
    
    const {addId,removeById,trigger}=Holder();
    app.use(express.json());
    app.get('/', function (req, res) {
        res.send('o-pubsub is online');
    });
    app.post('/',(req,res)=>{
        pubsub.publish(req.body);
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
        pubsub.addId(
                req.body.id,
                req.body.pattern,
                data=>{res.write(JSON.stringify(data))}
            
        );
    });
    app.delete('/:id',(req,res)=>{
        
    })
    return app.listen(3000);
}