import * as mysqlL from "mysql";
import * as AWS from "aws-sdk";
import { CONSTANTS } from "../_helpers";
import {UPDATE_DRAW_STATUS, GET_PLAYER, UPDATE_PLAYER_POINTS } from "./Queries";
import { Exception } from "./Exception";
import { emit } from "cluster";
const mysql = mysqlL;
let connection;

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");

const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18"
});
const lambda = new AWS.Lambda();


export const handler = async (event: any = {}): Promise<any> => {
  if (!connection) {
    initializeConnection();
  }

  try {
    const result = await updateDrawRequest(event.drawStatus,event.playerId);

    const playerData: any = await getPlayerFromDb(event.playerId);

    const player = playerData[0];
    let points = Number(player.gold_points) - Number(event.drawGoldPoints);

    console.log("##Player gold_points:", player.gold_points);
    console.log("##Player draw_gold_points:", event.drawGoldPoints);
    console.log("##DrawGold", points)

    if(event.drawStatus == 1)
    {
      sendEmail(player.email, "Accepted", event.drawGoldPoints);
       console.log("##Player email:", player.email);
       
     await updateCognitoUser(
      points,
      event.playerId
    );

    await updateRDSUser(points, event.playerId);
    }

    if(event.drawStatus == 2)
    {
      sendEmail(player.email, "Rejected", event.drawGoldPoints);
    }
   
    return result;

  } catch (e) {
    console.log("Error ", e);
    return {
      error: Exception.ERROR
    };
  }
};

const initializeConnection = () => {
  connection = mysql.createConnection({
    host: CONSTANTS.CHESSF_MYSQL_HOST,
    user: CONSTANTS.CHESSF_MYSQL_USER,
    password: CONSTANTS.CHESSF_MYSQL_PASSWORD,
    database: CONSTANTS.CHESSF_MYSQL_DATABASE
  });

  //change query format config to use name parameters
  connection.config.queryFormat = function(query, values) {
    if (!values) return query;
    return query.replace(
      /\:(\w+)/g,
      function(txt, key) {
        if (values.hasOwnProperty(key)) {
          return this.escape(values[key]);
        }
        return txt;
      }.bind(this)
    );
  };
};

 function getPlayerFromDb(playerId: string) {
return new Promise((resolve, reject) => {
  connection.query(
    GET_PLAYER,
    {playerId},
    (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    }
  );
});
}

function sendEmail(emailPlayer:string, message:string, drawPoints:Number) { 
  const msg = {
  to: emailPlayer,
  from: 'support@chess.com',
  subject: 'Withdraw request',
  text: 'send email',
  html: ` <body>
  <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#ffffff;">
    <div class="webkit">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#ffffff">
        <tbody><tr>
          <td valign="top" bgcolor="#ffffff" width="100%">
            <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
              <tbody><tr>
                <td width="100%">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tbody><tr>
                      <td>
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                  <tbody><tr>
                                    <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#ffffff" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
<tbody><tr>
  <td role="module-content">
    <p></p>
  </td>
</tr>
</tbody></table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-mc-module-version="2019-10-22" data-muid="nJJ6XzJY7PTyegVXHopVBt">
  <tbody><tr>
    <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor=""><div><h1 style="text-align: center"><strong>CHESS WIN App</strong></h1><div></div></div></td>
  </tr>
</tbody></table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-mc-module-version="2019-10-22" data-muid="djReP7qEfZhASuLcSpbEc7">
  <tbody><tr>
    <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor=""><div><div style="font-family: inherit; text-align: inherit">Your request on withdrawing ${drawPoints} gold points, is ${message}.</div><div></div></div></td>
  </tr>
</tbody></table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="jCWZcWKGHsQEkN4p13WVeX">
  <tbody><tr>
    <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
    </td>
  </tr>
</tbody></table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-mc-module-version="2019-10-22" data-muid="9b5RQj3Bemgp8B3snJKGCA">
  <tbody><tr>
    <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor=""><div><div style="font-family: inherit; text-align: inherit">Yours,</div>
<div style="font-family: inherit; text-align: inherit">Chess Win Team</div><div></div></div></td>
  </tr>
</tbody></table></td>
                                  </tr>
                                </tbody></table>
                      </td>
                    </tr>
                  </tbody></table>
                </td>
              </tr>
            </tbody></table>
          </td>
        </tr>
      </tbody></table>
    </div>
  </center>
</body>`,
  };

  sgMail.send(msg);
    };

function updateDrawRequest(drawStatus:number, playerId: string) {
  let drawChangeDate = new Date().getTime();
  const parameters = {
    playerId,
    drawStatus,
    drawChangeDate
  };

  return new Promise((resolve, reject) => {
    connection.query(
      UPDATE_DRAW_STATUS,
      parameters,
      (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

const updateCognitoUser = async (points: any, winnerId: string) => {
  console.log("Points (before saving to cognito)", points);

  return cognito
    .adminUpdateUserAttributes({
      UserAttributes: [
        {
          Name: "custom:gold_points",
          Value: "" + points
        }
      ],
      UserPoolId: CONSTANTS.USER_POOL_ID,
      Username: winnerId
    })
    .promise();
};


export const updateRDSUser = async (points: any, userId: string) => {
  console.log("Points (before saving to RDS)", points);

  const params = {
    goldPoints: points,
    userId
  };

  return new Promise((resolve, eject) => {
    connection.query(UPDATE_PLAYER_POINTS, params, function(
      error,
      results,
      fields
    ) {
      if (error) {
        eject(error);
      } else {
        resolve(results);
      }
    });
  });
};