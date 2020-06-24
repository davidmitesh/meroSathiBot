// bottender.config.js
module.exports = {
  channels: {
    messenger: {
      enabled: true,
      path: "/webhooks/messenger",
      pageId: process.env.MESSENGER_PAGE_ID,
      accessToken: process.env.MESSENGER_ACCESS_TOKEN,
      appId: process.env.MESSENGER_APP_ID,
      appSecret: process.env.MESSENGER_APP_SECRET,
      verifyToken: process.env.MESSENGER_VERIFY_TOKEN,
      profile: {
        getStarted: {
          payload: "GET_STARTED"
        },
        persistentMenu: [
          {
            locale: "default",
            composerInputDisabled: false,
            callToActions: [
              {
                type: "postback",
                title: "Make a appointment with pyschiatrist.",
                payload: "CARE_HELP"
              },
              {
                type: "postback",
                title: "Mental Health events around",
                payload: "CURATION"
              },
              {
                type: "web_url",
                title: "Toll Free Helpline Numbers",
                url: "https://www.originalcoastclothing.com/",
                webviewHeightRatio: "full"
              }
            ]
          }
        ]
      }
    }
  }
};
