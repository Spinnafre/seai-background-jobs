export const ftpConfig = {
  host: process.env.FTP_FUNCEME_HOST,
  user: process.env.FTP_FUNCEME_USER,
  password: process.env.FTP_FUNCEME_PASSWORD,
  keepalive: 10000,
  pasvTimeout: 10000,
  connTimeout: 15000,
  port: 21,
};
