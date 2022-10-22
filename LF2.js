var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var sqs = new AWS.SQS();
var https = require('https');
var ses = new AWS.SES({ region: "us-east-1" });
//var async = require('asyncawait/async');
//var await = require('asyncawait/await');
//console.log("Hi");
var data_got;
//const ddbv3 = new DocumentClient();
// var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

//const { curl } = rvequire('node-libcurl');
//const curlobj = new curl();
// async function ddb(restaurant_id){
//     return new Promise((resolve,reject) => {
//         try{
//         var docClient = new AWS.DynamoDB.DocumentClient();
//         var params2 = {
//         TableName : "yelp-restaurants",
//         KeyConditionExpression:"id = :id1",
//         ExpressionAttributeValues: {
//         ":id1": { S : String(restaurant_id) }
//         //":id1" : String(restaurant_id)
//         },
//         // ExpressionAttributeNames:{'#id':'id' }
//         //ProjectionExpression: 'display_phone,'
//              };
//         docClient.query(params2,function(d)
//         {
//             console.log(d);
//         }); 
           
//         }
//         catch(err)
//         {
//             console.log("error in ddb2");
//         }
//     } );
// }

function httprequest(cuisine) {
    //console.log(cuisine);
     return new Promise((resolve, reject) => {
        const options = {
            host: 'search-yelp-restaurantid-cuisine-ncxoslfjfg4blt6q7atwdtbsoi.us-east-1.es.amazonaws.com',
            //path: '/restaurants/Restaurant/_search?q=cuisine:japanese&size=100',
            path:'/restaurants/Restaurant/_search?q=cuisine:'+ cuisine+ '&size=1000',
            port: 443,
            method: 'GET',
            // auth : {
            //     username: 'assignment1',
            //     password: 'Assignment1$'
            //         }
              headers: {
                    'Authorization': 'Basic ' + new Buffer('assignment1' + ':' + 'Assignment1$').toString('base64')
                        }             
        };
        const req = https.request(options, (res) => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }
            var body = [];
            res.on('data', function(chunk) {
                body.push(chunk);
            });
            res.on('end', function() {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch(e) {
                    reject(e);
                }
                resolve(body);
            });
        });
        req.on('error', (e) => {
          reject(e.message);
        });
        // send the request
       req.end();
    });
}
exports.handler = async (event) => {

var params = {
    "QueueUrl":"https://sqs.us-east-1.amazonaws.com/592360254578/DiningSuggestionsIntentInfo.fifo",
    "MaxNumberOfMessages":1
};
//receive message
var received_data;//array of objs
var sqshandle = await sqs.receiveMessage(params, function(err, data) {
  if (err) {
      console.log(err, err.stack);
  }// an error occurred
  else   {
      received_data = data;
      //console.log(data);           // successful response
  }
}).promise();
console.log(sqshandle);
// return {
//     "data":received_data
// };
if(received_data !== undefined)
var message_arr = received_data["Messages"];
//receive one message everytime
if(message_arr)
var message = JSON.parse(message_arr[0]["Body"]);
// return {
//     "message":JSON.parse(message)
// };
var user_selected_cuisine;
if(message){
user_selected_cuisine = message["Cuisine"];
}
console.log(message);
//import {DocumentClient} from "@aws-sdk/client-dynamodb";
// return {
//     user_selected_cuisine
// };

//get a random restaurant from elastic search based on user selected cuisine
// var received_message;
// await http.request("https://search-yelp-restaurantid-cuisine-ncxoslfjfg4blt6q7atwdtbsoi.us-east-1.es.amazonaws.com/restaurants/Restaurant/_search?q=cuisine:japanese",(res) => {
//     const { statusCode } = res;
//     // if(statusCode == 200)
//     // {
//         //success
//         res.on('end',function(mes)
//         {
//             received_message = mes;
//         });
        
//         // res.on('error',function(err)
//         // {
//         //     console.log("Error elastic search");
//         // });
//     // }
// });
// console.log(received_message);
//need to delete message from the queue
//start - 1
return httprequest(user_selected_cuisine).then((data) => {
        const response = {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    var body = JSON.parse(response["body"]);
    var array_hits = body["hits"]["hits"];
    
    //randomly select a restaurant from the hits
    var random_num = Math.floor(Math.random() * (array_hits.length));
    
    //get restaurant id of this random restaurant
    var restaurant_id = array_hits[random_num]['_source']['id'];
    console.log(restaurant_id);
    //query dynamoDB
    
    // var params2 = {
    //     TableName : "yelp-restaurants",
    //     KeyConditionExpression:"id = :id1",
    //     ExpressionAttributeValues: {
    //     ":id1": { S : String(restaurant_id) }
    //     //":id1" : String(restaurant_id)
    //     },
       
       
    //     //ProjectionExpression: 'display_phone,'
    // };
    console.log(restaurant_id);
    //const doc = new AWS.DynamoDB.DocumentClient();
    // var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    // dynamodb.query(params,function(err,data){
    //     if(err)
    //     {
    //         console.log(typeof err);
    //     }
    //     else{
    //         console.log(typeof data);
    //     }
    // }).promise();
    // var data_restaurant;
    // console.log("here");
    // dynamodb.query(params,function(err,data){
    //     if(err)
    //     {
    //     console.log("error dynamodb method");
    //     //console.log(err,err.stack);
    //     }
    //     else{
    //         data_restaurant = data.Items;
    //         console.log("success dynamodb");
    //         //console.log(data.Items);
    //     }
    // }).promise();
    // console.log(data_restaurant);
    // return data_restaurant;
    //return dynamodb;
    
   
//  var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
        var params2 = {
        TableName : "yelp-restaurants",
        KeyConditionExpression:"id = :id1",
        ExpressionAttributeValues: {
        ":id1": String(restaurant_id)//"ZrzSDDj54aUlPqn4MQMKeQ" 
        //{ S : 'ZrzSDDj54aUlPqn4MQMKeQ'}//String(restaurant_id) }
        //":id1" : String(restaurant_id)
        },
        ScanIndexForward:false
        //ExpressionAttributeNames:{'#id':'id' }
        //ProjectionExpression: 'display_phone,'
    };

//trying scan
// var params_scan = {
//   TableName : 'yelp-restaurants',
//   FilterExpression : 'id = :this_id',
//   ExpressionAttributeValues : {':this_id' : 'ZrzSDDj54aUlPqn4MQMKeQ'}
// };
var documentClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10','region':'us-east-1' });
var received_random_restaurant_details;
//console.log(documentClient);
const promise = new Promise(function(resolve,reject){
    documentClient.query(params2,function(err,data){
        //console.log("resolving now");
        //console.log(data);
        if(err)
        {
            reject("Error reject");
        }
        else{
        received_random_restaurant_details = data;
        console.log(received_random_restaurant_details["Items"][0]["location"]["display_address"]);
        //compose message with received details
        var email_body_one = "Hi, Thank you for using the Dining Chatbot. Here is the restaurant recommendation\n";
        var restaurant_name = received_random_restaurant_details["Items"][0]["name"];
        var restaurant_address = received_random_restaurant_details["Items"][0]["location"]["display_address"];
        var restaurant_phone = received_random_restaurant_details["Items"][0]["display_phone"];
        var email_body_two = String(restaurant_name) + ", " + JSON.stringify(restaurant_address) + ", "+String(restaurant_phone);
        var email_body = email_body_one+email_body_two;
        console.log(email_body);
        var email_address = String(message['EmailAddress']);
        console.log(email_address);
        //ses
         var params_email = {
        Destination: {
        ToAddresses: [email_address],
                    },
        Message: {
        Body: {
        Text: { Data: email_body },
                },

        Subject: { Data: "Restaurant Recommendation" },
    },
    Source: "ml7181@nyu.edu"
         };
         //send email
        //console.log(ses);
        //******
        // var promise_email = ses.sendEmail(params_email,function(err,data){
        //     if(err)
        //     {
        //         console.log("Error while sending email");
        //     }
        //     else{
        //         //console.log(data);
        //         console.log("email was sent successfully");
        //     }
        // }).promise();
        // console.log(promise_email);
        // promise_email.then(function(data){
        //     console.log(data);
        //     return 
        // }).catch(function(err){
        //     console.error(err,err.stack);
        // })
        //**********
        const promise_email = new Promise(function(resolve,reject){
            ses.sendEmail(params_email,function(err,data){
            if(err)
            {
                reject("Error email sending reject");
                console.log(err);
            }
            else{
                //console.log(data);
                resolve("email sent successfully");
                console.log(data);
            }
        })
        
        
        });
        promise_email.then(function(msg)
        {
            console.log(msg);
            //delete messages from the queue - get message handle from above
            if(sqshandle.Messages)
            {
                var delete_param = {
                    QueueUrl:"https://sqs.us-east-1.amazonaws.com/592360254578/DiningSuggestionsIntentInfo.fifo",
                    ReceiptHandle:sqshandle.Messages[0].ReceiptHandle
                };
                const delete_promise = new Promise(function(resolve,reject)
                {
                    sqs.deleteMessage(delete_param,function(err,data)
                    {
                    if(err)
                    {
                        reject(err);
                        console.log("error deleteing message");
                        //console.log(err);
                    }
                    else
                    {
                        resolve(data);
                        console.log("delete message successfully");
                        //console.log(data);
                    }
                });
                });
                
                delete_promise.then(function(data)
                {
                    console.log(data);
                }).catch(function(err)
                {
                    console.log(err);
                });
            }
            
            //return promise;
        }).catch(function(erro)
        {
            console.log(erro);
        });
//   return ses.sendEmail(params).promise()
//temp - comment - start
        //resolve(received_random_restaurant_details);
//temp - comment - end
        }
   // });
    // }).on('error',(e) => {
    //     console.log("error now");
    //     reject((e))
    });
});
//temp - comment - start
return promise;
//temp - comment - end
// documentClient.scan(params_scan, function(err, data) {
//   if (err) console.log(err);
//   else console.log(data);
// });
// await documentClient.scan(params_scan).promise();
//     }).promise();
// console.log("outside");
// docClient.query(params2).promise().then(function(obj) {
//     console.log("indise");
//     console.log(obj);
// },function(er){
//     console.log("inside error here");
// });
    //const data2 = docClient.scan(params).promise()
    //console.log(ddbv3);
    // await ddb('ZrzSDDj54aUlPqn4MQMKeQ');
//     return {
//     "test":"hey"
//             };
   });
    

//end - 1

};
