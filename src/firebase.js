import admin from 'firebase-admin';
// import serviceAccount from './config/serviceAccountKey/serviceAccountKey.json' assert { type: 'json' };

const service = {
  "type": "service_account",
  "project_id": "airbnb-4f322",
  "private_key_id": "7e3df10fe97d6ddd582cb6a42c19bf85d2711d81",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDhgelWBoFeC1A\nntXrAYpBDukTLvVgw8nqHeTnmKYnUQdj7R1OXDNIU7i6XT565PKeuePfmnw3ofJc\n/RduKShSQI4qszRfJ/D2X4mAQhqOagaB2nyYq0dgEFqYs5shXSmWKYSTCdXmNKMZ\nH/E9BRlwwEUI1B1t1s+h5YiWr70ZDSpSI7f4NG3jkoYZH1QCzy54zpodTGbeCoY+\ncHp4HAx21oeMaQVY4VHWwCP5thNLGgaZTkq2tW607MqsIotT+F5h8fuNFjuJ5Ks3\n8R4OeHEUCR7Kp0j6VpFhx44vuMSfRpT3OPG/sYTthYq+Kt7Aqzk6LN7nZGTFMcip\nPFUwevDzAgMBAAECggEACCGbUMuErYSNcToJ0G+sdb8ufz89MiyCSau7mMwW4Ny0\nT3oNdXRNJ61fqdR15DuAQYyehu6QSun/v9FAt7KbfCw2HV19iJWLJlvbxos5OoH7\nSkwxUVISMlMLyXzyryUGNTn9yvWmQSAgRku3Rx/eqns8g7z6ilZcJTH8B7RAS3nX\nkRsnYT/h2L0fcYwUdmtAxnZep74d/0z9Q+/ytzkmdL4yaI0Riu/957B/DDEdW1i4\nojTsWdWVQ3sO2CKOOqpxSiw+/JfN+naWhgeoNq/qrq+393EKT7XNTPsM7OQUbax2\nZfw5lmQBCyHcRdLviZd7zjxBqLlSIkvRvldn+6ndoQKBgQDoNMBk4IAEWvSWY9Yw\nNlYZUJuPsJ2nIb5PkXtac9SJxujN8rD3HLquSCUggt/tFMr+mGRYaQHJXwglZiZx\nxn+VBlv+1BQYUiDiAiKSuy4lZo169m/8HtVS9MIMGAUG7KWmyC9+5lXGiFxPG7nm\nyDJ+yrW+PRolaXZOBxdV01yNUwKBgQDXjwURxmK7qX6YJsuOvEwSsdY6pVenyqt/\nPd4xPIH2sq9jxjInIBA0eHKmOShg36cvLZ48P1ZFwhFTHY7r7g9zZy6+4utyg77/\nNSHh2O/nBkEDwta4AWTgbLTtUQtkfVW8B/+UUsxeh3QmM6JLMB8thfSH8MjgGskk\nTHfnu//54QKBgQCO/XUAabLLe8skFQSfmcY5Pocc29CpS8EqtFa2o59c3G0d7XYG\nJd3bVrfuJkmIcAZ08xjPzJH6FBgrF5VS+L414b2i1awuMdzn8BKkMrm+9EDpWHor\nUj1hITGhSuVFl1KGur1ssqBdajkVyegXcm6N33w9UtkX8rKUaA95nXdf2wKBgBU3\n08TrJT7ZsUdi0jirmkVg0fiV2+n9TiJJQbzQ+u4AqrkEgl1Nj6rKjGaGS841VayU\nLfY6OdDGCJSI3U+l8Elox7Ysegacp0lRvpMPmpXADNhE7oPQR1C8Apc1mgx7Ndw7\nYVIFUG6hoLI99OS3yOnfPLHA5tUAbfovuMHLxKehAoGAetIUKieTmVJnoMCr1o22\nb7mMHnia1+UwVPWharkaiMrhsTe7t003dlkrl+rONlobeENiYfk9j303r+tJM0ZF\niIqHLtJY+X0ITJj4qgqZnKVrU9cjeIECVY7/5q9vr6k22j5QGN5ttWQJFzByJL07\nOgODObty1a+NQC+ejOXOFKU=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-ankmr@airbnb-4f322.iam.gserviceaccount.com",
  "client_id": "106647115597863669666",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ankmr%40airbnb-4f322.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

admin.initializeApp({
  credential: admin.credential.cert(service),
  databaseURL: 'https://airbnb-4f322-default-rtdb.firebaseio.com', 
});

const database = admin.database();

export { admin, database }
