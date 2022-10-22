// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var sqs = new AWS.SQS();
function validate_fields(slot_values_map)
{
    //validate fields here
}
exports.handler = async (event) => {
    // TODO implement
    // const response = {
    //     statusCode: 200,
    //     body: JSON.stringify('Hello from Lambda!'),
    // };
    // return response;
    //add - start 
    if(event["invocationSource"] == "DialogCodeHook")
    {
        //validate fields
        const slot_map = event['currentIntent']['slots'];
        const numberp = slot_map["NumberOfPeople"];
        if (numberp != null)
        {
        var modified_slot_values_map = JSON.parse(JSON.stringify(slot_map));
        if(Number(numberp) <= 0 || Number(numberp) >= 20){
        modified_slot_values_map['NumberOfPeople'] = "";
        console.log("inside ellicit slot");
         return {
        //'sessionAttributes': session_attributes,
        'dialogAction': {
            'type': 'ElicitSlot',
            'intentName': 'DiningSuggestionsIntent',
            'slots': modified_slot_values_map,
            'slotToElicit': 'NumberOfPeople',
            'message': 'The number of people must be greater than 0 and less than 20'
        }
    }
    }
        }
    }
    
    //add - end
    const slot_values_map = event['currentIntent']['slots'];
    const confirmation_status = event['currentIntent']['confirmationStatus'];
    if(confirmation_status == "Confirmed")
    {
        //push to SQS only if status is confirmed and after fields validation
        //if fields not validated, return the denied response intent
        //if (validate_fields(slot_values_map) == true)
        //{
              const location = slot_values_map["Location"];
              const cuisine = slot_values_map["Cuisine"];
              const time = slot_values_map["DiningTime"];
              const numberpeople = slot_values_map["NumberOfPeople"];
              const email = slot_values_map["EmailAddress"];
              let sqs_message = {
                  "Location":location,
                  "Cuisine":cuisine,
                  "DiningTime":time,
                  "NumberOfPeople":numberpeople,
                  "EmailAddress":email
              };
              let sqs_message_string = JSON.stringify(sqs_message);
              console.log(sqs_message_string);
              console.log(sqs);
              console.log(event)
              var params = {
                  "MessageBody":sqs_message_string,
                  "QueueUrl":"https://sqs.us-east-1.amazonaws.com/592360254578/DiningSuggestionsIntentInfo.fifo",
                  "MessageGroupId":"tag_one"
              };
                var success = false;
              //try{
                  //await not necessary because this takes a callback
                  await sqs.sendMessage(params,function(err,data)
                  {
                      if(err)
                      {
                          //return a response with unfulfilled intent
                          console.log(err);
                          console.log("error here");
                      }
                      else{
                          console.log("returned successfully after sqs here")
                          console.log(data);
                          success = true;
                        //   return {
                        //      "dialogAction": {
                        //      "type": "ElicitIntent",
                        //       "message": {
                        //       "contentType": "PlainText",
                        //       "content": "Thank you, your information has been saved. You will be notifed about the dining suggestion via email"
                        //                 }
                        //             }
                        //         };
                        
                      }
                  }
                  ).promise();
                  if(success === true)
                  {
                         return {
                             "dialogAction": {
                             "type": "ElicitIntent",
                              "message": {
                              "contentType": "PlainText",
                              "content": "Thank you, your information has been saved. You will be notifed about the dining suggestion via email"
                                        }
                                    }
                                };
                  }
             // }
              //catch{
                  
              //}
        //}
        
    //                 return {
    //     "dialogAction": {
    //     "type": "ElicitIntent",
    //      "message": {
    //      "contentType": "PlainText",
    //      "content": JSON.stringify(confirmation_status)
    //                 }
    //             }
    // };
        
    }
    
    //         return {
    //     "dialogAction": {
    //     "type": "ElicitIntent",
    //      "message": {
    //      "contentType": "PlainText",
    //      "content": "Hi There, How can I help you?"
    //                 }
    //             }
    // };
};
