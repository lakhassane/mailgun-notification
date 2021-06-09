
import { APIGatewayEvent, Handler } from 'aws-lambda';

import { publishSNS, saveInDB } from "../../actions";

export const respond = (fulfillmentText: any, statusCode: number): any => {
  return {
    statusCode,
    body: JSON.stringify(fulfillmentText),
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    }
  }
}

export const saveRawNotification: Handler = async (event: APIGatewayEvent) => {
  console.log('Processing Mailgun notification...');

  try {
    console.log('Saving raw notification to Database!');
    const timestamp: Number = Math.floor(Date.now() / 1000);
    await saveInDB(event, timestamp);
    return respond({ created: JSON.parse(event.body).body }, 200)
  }
  catch (err) {
    return respond(err, 400)
  }
}

export const sendSNS: Handler = async (event: APIGatewayEvent) => {
  console.log('Processing Mailgun notification...');
  const body = JSON.parse(event.body).body;
  let notif: any;
  if (typeof body === 'string') {
    notif = JSON.parse(body);
  } else if (typeof body === 'object') {
    notif = body;
  }

  const incomingNotif: Object = {
    Provider: 'Mailgun',
    timestamp: notif.signature.timestamp,
    type: `email ${notif['event-data'].event.toLowerCase()}`
  }

  try {
    console.log('Publishing SNS!');
    await publishSNS(incomingNotif);
    return respond({ created: incomingNotif }, 200)
  }
  catch (err) {
    return respond(err, 400)
  }
}