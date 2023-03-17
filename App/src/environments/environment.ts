const ip = window.location.hostname;
let host = 'localhost';
if (ip === '10.4.4.224') {
  host = ip;
}
export const lineConfig = {
  authorizeUrl: 'https://access.line.me/oauth2/v2.1/authorize',
  client_id: '1654240194',
  client_secret: 'a347ba7169bfaa6b2d09e385ef2bec4a',
  redirect_uri: `http://${ip}:58/api/Line/Callback`,
  state: 'NO_STATE',

  notifyAuthorizeUrl: 'https://notify-bot.line.me/oauth/authorize',
  notifyClient_id: 'VcgmUOhlRuWHEdY83fKjl3',
  notifyRedirect_uri: `http://${ip}:58/api/LineNotify/Callback`,
};
export const environment = {
  production: false,
  apiUrl: `http://${ip}:58/api/`,
  hub: `http://${ip}:58/line2u-hub`,
  apiUrlImage: `http://${ip}:58`,
  versionCheckURL : '/assets/version.json',
  redirectOfficialAccount: `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${lineConfig.client_id}&redirect_uri=${lineConfig.redirect_uri}&state=NO_STATE&scope=profile%20openid%20email
  `,
  redirectLineAuthorize: `${lineConfig.authorizeUrl}?response_type=code&client_id=${lineConfig.client_id}&redirect_uri=${lineConfig.redirect_uri}&state=12345abcde&scope=profile%20openid%20email&nonce=09876xyz`,
  notifyRedirectLineAuthorize: `${lineConfig.notifyAuthorizeUrl}?response_type=code&client_id=${lineConfig.notifyClient_id}&redirect_uri=${lineConfig.notifyRedirect_uri}&scope=notify&state=NO_STATE`,
  domain: `http://10.4.5.174:58`
};
