const { google } = require("googleapis");

async function getGoogleSheetsData (options){

    const auth = new google.auth.JWT({
        keyFile: "./google-credentials.json",
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    
    const readData = async (auth, options) => {
        const googleSheets = google.sheets( {version:"v4", auth});
        let result = [], status;
        try{
            const response = await googleSheets.spreadsheets.values.get(options);
            result = response.data.values;
            status = "success";
        } catch(e){
            result = err;
            status = "error";
        }
        return ({status, result});
    }

    let response;
    
    try{
        response = await readData(auth, options);
    } catch(e) {
        response = {
            result: err,
            status: "error"
        }
    }
    
    return response;
}


async function getGoogleAuthAndExecute (callback, ...args){
    const auth = new google.auth.JWT({
        keyFile: "./google-credentials.json",
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    
    let response;

    auth.authorize( async(err, tokens) => {
        if(err){
            console.log(err);
            return {
                status: 'error',
                result: err
            };
        } else{
            response = await callback(auth, ...args);
        }
    });
    
    return response;
}

async function readData(auth, options){
    const googleSheets = google.sheets( {version:"v4", auth});
    let result = [], status;
    try{
        const response = await googleSheets.spreadsheets.values.get(options);
        result = response.data.values;
        status = "success";
    } catch(e){
        result = err;
        status = "error";
    }
    console.log('readData');
    console.log({status, result});
    return ({status, result, additional: "data"});
}

module.exports = {getGoogleSheetsData};

