var express = require("express");
var app = express();
const Holder = require("./holder");

module.exports = (opts)=>{
    const {add,remove,trigger}=Holder(opts);
    let connections={};
    app.use(express.json());
    app.get("/o-pubsub/", function (req, res) {
        res.send("o-pubsub is online");
    });
    app.post("/o-pubsub/",(req,res)=>{
        trigger(req.body);
        res.status(200).send("published");
    });
    app.put("/o-pubsub/:id",(req,res)=>{
        const id=req.params.id;
        connections[id]={ id, res};
        add(
                id,
                req.body,
                data=>{res.write(JSON.stringify(data));}
            
        );
        const unsubscribe=()=>{
            remove(id);
        };
        res.on("error",()=>{
            unsubscribe();
        }
        ).on("close",()=>{
            unsubscribe();
        });
    });
    app.delete("/o-pubsub/:id",(req,res)=>{
        const id=req.params.id;
        const cpy=connections;
        cpy[id]?.res?.destroy();
        delete cpy[id];
        connections=cpy;
        remove(id);
        res.status(200).send();
    });
    return app;
};