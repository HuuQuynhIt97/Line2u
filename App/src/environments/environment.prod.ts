const ip = window.location.hostname;
export const lineConfig = {
  authorizeUrl: 'https://access.line.me/oauth2/v2.1/authorize',
  client_id: '1657897673',
  client_secret: 'c06f049a22f18ca26bc503e722f3a1ab',
  redirect_uri: `https://${ip}/api/Line/Callback`,
  state: 'NO_STATE',

  notifyAuthorizeUrl: 'https://notify-bot.line.me/oauth/authorize',
  notifyClient_id: 'VcgmUOhlRuWHEdY83fKjl3',
  notifyRedirect_uri: `http://${ip}/api/LineNotify/Callback`,
};
export const environment = {
  production: true,
  apiUrl: '/api/',
  hub: `/line2u-hub`,
  apiUrlImage: '',
  redirectOfficialAccount: `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${lineConfig.client_id}&redirect_uri=${lineConfig.redirect_uri}&state=NO_STATE&bot_prompt=aggressive&scope=profile%20openid%20email
  `,
  redirectLineAuthorize: `${lineConfig.authorizeUrl}?response_type=code&client_id=${lineConfig.client_id}&redirect_uri=${lineConfig.redirect_uri}&state=12345abcde&scope=profile%20openid%20email&nonce=09876xyz`,
  notifyRedirectLineAuthorize: `${lineConfig.notifyAuthorizeUrl}?response_type=code&client_id=${lineConfig.notifyClient_id}&redirect_uri=${lineConfig.notifyRedirect_uri}&scope=notify&state=NO_STATE`,
  versionCheckURL : '/assets/version.json',
  domain: `http://evse.acv-vision.com`
};
