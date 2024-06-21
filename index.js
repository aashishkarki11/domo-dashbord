import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import base64 from "base-64";

dotenv.config();
const app = express();

app.get("/", async (req, res) => {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const DOMO_TENANT_URL = process.env.DOMO_TENANT_URL;
    const CARD_ID1 = process.env.CARD_ID1;
    const CARD_ID2 = process.env.CARD_ID2;
    const CARD_ID3 = process.env.CARD_ID3;
    const CARD_ID4 = process.env.CARD_ID4;
    const PAGE_ID1 = process.env.PAGE_ID1;

    const encodedCredentials = base64.encode(`${clientId}:${clientSecret}`);

    try {
        const response = await axios({
            method: "POST", url: "https://api.domo.com/oauth/token", params: {
                grant_type: "client_credentials", scope: "data workflow audit buzz user account dashboard",
            }, headers: {
                Accept: "application/json", Authorization: `Basic ${encodedCredentials}`,
            },
        });

        const accessToken = response.data.access_token;

        res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Domo Embed</title>
      </head>
      <body>
          <iframe src="${DOMO_TENANT_URL}/embed/card/private/${CARD_ID1}?access_token=${accessToken}"
              width="600" height="600" marginheight="0" marginwidth="0" frameborder="0"></iframe>
      </body>
      <body>
          <iframe src="${DOMO_TENANT_URL}/embed/card/private/${CARD_ID2}?access_token=${accessToken}"
              width="600" height="600" marginheight="0" marginwidth="0" frameborder="0"></iframe>
      </body>
      <body>
          <iframe src="${DOMO_TENANT_URL}/embed/card/private/${CARD_ID3}?access_token=${accessToken}"
              width="600" height="600" marginheight="0" marginwidth="0" frameborder="0"></iframe>
      </body>
      <body>
          <iframe src="${DOMO_TENANT_URL}/embed/card/private/${CARD_ID4}?access_token=${accessToken}"
              width="600" height="600" marginheight="0" marginwidth="0" frameborder="0"></iframe>
      </body>
      <br>
       <body>
          <iframe src="${DOMO_TENANT_URL}/embed/pages/private/${PAGE_ID1}?access_token=${accessToken}"
              width="1024" height="1024" marginheight="0" marginwidth="0" frameborder="0"></iframe>
      </body>
      </html>
    `);
    } catch (error) {
        console.error("Error generating access token:", error);
        res.status(500).send("Failed to authenticate");
    }
});

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
