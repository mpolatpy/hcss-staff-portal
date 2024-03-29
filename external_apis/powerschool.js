const { Buffer } = require('buffer');
const axios = require('axios');
const querystring = require('querystring');

class PowerSchoolClient {
    constructor(PS_CLIENT_ID, PS_CLIENT_SECRET){
        this.initial_token = Buffer.from(`${PS_CLIENT_ID}:${PS_CLIENT_SECRET}`).toString('base64');
    }

    fetchData = async (URL, queryParam=null) => {
        let page = 1;
        // if(queryParam && queryParam.includes(',')){
        //     queryParam = queryParam.replace(',', '%2C');
        // }
        const data = queryParam? {'$q': queryParam} : {};
        const url = 'https://hcss.powerschool.com/oauth/access_token/';
        let result = [], status;
        try{
            const res = await axios.post( url, 
                querystring.stringify({ 'grant_type': 'client_credentials'}), 
                {
                    headers: {
                        'Authorization': `Basic ${this.initial_token}`,
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    },
                }
            );
            const accessToken = res.data['access_token'];
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            };

            while(true){
                const resp = await axios.post(URL, 
                    data,
                    {
                        headers: headers,
                        params: {
                            pagesize: 100,
                            page: page++
                        }
                    }
                );
                if(!resp.data['record']) break;
                result = [...result, ...resp.data['record']];
            }
            status = 'success'; 
        }catch(e) {
            status = 'error';
            result = e;
            console.log(e)
        }

        return {status, result};
    }
}

module.exports = {PowerSchoolClient};