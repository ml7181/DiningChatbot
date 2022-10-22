exports.handler = async (event) => {
    // TODO implement
    // const response = {
    //     statusCode: 200,
    //     body: JSON.stringify('Hello from Lambda!'),
    // };
    // return response;
    var greeting = "Evening";
    let date_ob = new Date();
    let hour = date_ob.getHours();
    if(Number(hour) < 12)
    {
        greeting ="Morning";
    }
    else if(Number(hour) >= 12 && Number(hour) < 16)
    {
        greeting = "Afternoon";
    }
    var message_content = "Hi, Good "+greeting+" How can I help you?";
    // if(event["currentIntent"]["name"] == "GreetingIntentFulfillLex")
    // {
        //const intent = event["intent"]["name"]
        return {
        "dialogAction": {
        "type": "ElicitIntent",
         "message": {
         "contentType": "PlainText",
         "content": message_content
                    }
                }
    };
    //}
    // else{
    //     throw "Incorrect Intent";
    // }
};
