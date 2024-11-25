const fsPromise = require("fs/promises")

exports.getCoreApi = () =>{
    return fsPromise.readFile(`${__dirname}/../endpoints.json`, "utf-8").then((results)=>{
        return JSON.parse(results)
    })
}