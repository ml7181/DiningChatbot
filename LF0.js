var AWS = require('aws-sdk');
var lexruntime = new AWS.LexRuntime();

exports.handler = async (event) => {
    // TODO implement
    // const response = {
    //     statusCode: 200,
    //     body: JSON.stringify("Application under development. Search functionality will be implemented in Assignment 2"),
    // };
    //const times = Date.now();
    // console.log(event);
    var entered_messages_body = JSON.parse(event['body']);
    var message = entered_messages_body['messages'][0]['unstructured']['text'];
    console.log(message);
    //console.log(entered_messages_array[0].unstructured.text);
    // //for now, consider only the first message in the array, to ASK
    //var entered_message_obj = entered_messages_array[0];
    // var message = entered_message_obj['unstructured']['text'];
    // console.log("message extracted is "+message);
    var lex_init_params = {
      'botAlias':'dev_two',
      'botName':'DiningConciergeChatbot',
      'inputText':message,
      'userId':'12'
      
    };
    var lex_response_message;
    await lexruntime.postText(lex_init_params, function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
        }
          else{
              console.log(data);  
              console.log(data.message);
              lex_response_message = data.message;
              }// successful response
            }).promise();
    console.log(lex_response_message);
    let unstructured_message = {
      id:"",
      text:lex_response_message,//"Application under development. Search functionality will be implemented in Assignment 2",
      timestamp:""
    }
    let message_array = [
      {
        type:"unstructured",
        unstructured:unstructured_message
      }
      ];
    
    const response = {
    messages:message_array
    }
    return {
      'statusCode':200,
      'headers':{
        'Content-Type':'application/json',
        'Access-Control-Allow-Origin':'*'
      },
      'body':JSON.stringify(response)
    };
};
