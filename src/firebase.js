import admin from 'firebase-admin';
// import serviceAccount from './config/serviceAccountKey/serviceAccountKey.json' assert { type: 'json' };

const service = {
  "type": "service_account",
  "project_id": "airbnb-4f322",
  "private_key_id": "f2b0d6721e057a8f766d4168b0f69e562035c5c6",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDQATEAeCKSUdGb\nY33NUbIX3UaHhmD31f2N/ITX2lWCIODF0qpxMuSpf0te0c19p5mDgNwg+xZ/XgUi\nVZSptQ40UQqZMkAWYN19uf/MS50R37KryODfFSwupmxz89OVplBplrieRwegOoZW\nNEiAlvVc3NETBxPbHFCI6papDIoVf23cgjQc9YsJ+Ue5ySGCciSIUjPALy0WRbw/\nfwqDfKRWA5DAg20liqTXsxbyLEkUyzKWJcQQWSr/fElRAoxHaTqAjc58iQ/Tctsa\nV9AexmSssPBbw6zoTt4un7oanxTzgfWQ0YH93SI03mx0K0JifqXWMksH3EHXkK8N\nJnqTvTt3AgMBAAECggEAY9DmjHSaFoA352sHkDNPlN8lPNzyBIyGmA/hSdom5YLU\nimntS9Qh4erJpu9kPpPiebYpLJSBd86NBSxvYj8V2Wo4fUqdcX+7Wl2bEJUKg2zH\nR2Nm8fatlJddfQk5dFtyxDDFWIL6eFwNYinFzxtiFFWM6SYg06lTRljYwrfXPbfh\ny6/sxe1UaM7U+K+ZQwFnQCKoxA8ImBn8MrOf4/A/SrTjgYQnWM/TwurEN91F0yfk\ndv1+g5oRZHqrYNug+9/K/nCBAkBlhHD02Np7plheShI3phHhZYsR0x3VJvkkIamX\nrJpkGkTTacXqlbUsSyrjVqIriCetrVxMhikGlI0NaQKBgQD/UnOJ2zzCv0nXRizW\nZB8mE4vnV0dYZcMqiAt1bBmQpQQl8R9VLVP6nsW77sWPSJnomQZyV38CP6AmZBGU\non+kk2jkbaKJeR7AlpNBcfw+JEp2OF6ujmr0ghvv2GeBixKMvY6WW+a2/AVpHTPm\nDJLJkBLPajXbggKq2HSsqFygfwKBgQDQjpPIjyg4hXZobOYDmnRNCBXlh7q97tRZ\nhTZwEelm4gcaj/d0Kv9vKAMPUGCo76YUzHUdeoLVO3lVd4A5oJVxdQSFfXWOI94r\nHSGputGgRHvfE4/Y16ynvf6HAufUxBDT4qyNTwhROd7kLLFlpzfrvm6/yj9eXm12\nF+grcZjpCQKBgB142gdmvDvKsu5bll9lDUdq6DJbG8wzavTk4VW7lbPhqHnsvG4r\nnk8GttJ7vGhOvB1iVKEsQmfzCjyEPpdGrq9DqM79bM6roYYfm33pd3GA5OuClENY\nAzaYMjtcYo5MjGaclvH6R8aFjuZUTaJXfzYvIEy6+N6OwloQRF+Ny6tnAoGALkLC\nAyXGDSuFhUpKhxgWnhOiD8TYplK4pZbH6Xn/pMOUQc8XW5xCBp0AeMAigLaPx2NG\nwyAury+/DTcxqRa2r3D+bMHUdo/8MuIGWojHAN7P/z5ulPHaKWcac0YwuGA5P1az\nYbDbLnFAwKotO1gpLlCSblZlUgBuFVjeNey/t0kCgYEA/gpEj/GqHBJIFP75rTDG\nLDinMdi7hNUUmqGVR9OKNyoLkP03leBO+9zvFtmjAWQiFn5rvvD0BzMMKqbnReET\nLvtxAMhpCoddyth4gf8YxHN9sqVvt5XZK6+C0hRKLdIDu1goRCJrbBvo488pxMvw\n3EuAvD67HqXVxM6YsMdinQg=\n-----END PRIVATE KEY-----\n",
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
