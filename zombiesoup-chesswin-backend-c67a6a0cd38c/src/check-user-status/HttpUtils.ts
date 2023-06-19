import { CONSTANTS } from "../_helpers";
import * as aws4 from "aws4";
import axios from "axios";

export const makeRequest = (connectionId: string) => {
  let request = {
    host: CONSTANTS.WEBSOCKET_HOST,
    method: "GET",
    url:
      "https://" +
      CONSTANTS.WEBSOCKET_HOST +
      "/prod/%40connections/" +
      encodeURIComponent(connectionId),
    path: "/prod/%40connections/" + encodeURIComponent(connectionId)
  };

  let signedRequest = aws4.sign(request, {
    secretAccessKey: CONSTANTS.SECRET_ACCESS_KEY,
    accessKeyId: CONSTANTS.ACCESS_KEY_ID
  });

  return axios(signedRequest);
};
