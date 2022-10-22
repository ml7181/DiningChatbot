exports.handler = async (event) => {
    // TODO implement
    // const response = {
    //     statusCode: 200,
    //     body: JSON.stringify('Hello from Lambda!'),
    // };
    // return response;
    
            return {
        "dialogAction": {
        "type": "Close",
        "fulfillmentState": "Fulfilled",
         "message": {
         "contentType": "PlainText",
         "content": "Thank you for using the service. Have a great rest of your day"
                    }
                }
    };
};
