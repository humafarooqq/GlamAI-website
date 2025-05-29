// API Configuration
const API_CONFIG = {
  BASE_URL: 'http://139.59.85.26:5000',
  API_URL: 'https://makeupmongo.duckdns.org/api',
  MAKEUP_API_URL: 'https://transfermakeup.duckdns.org',
  IMAGE_DOMAINS: ['localhost', '139.59.85.26','makeupmongo.duckdns.org'],
  MONGODB_URI: 'mongodb://doadmin:izhan177k@db-mongodb-nyc1-12345-a0c5c5c5.mongodb.net:27017/ecommerceDB?authSource=admin&replicaSet=db-mongodb-nyc1-12345&tls=true&tlsCAFile=/etc/ssl/certs/ca-certificates.crt'
};

// Other configurations can be added here
const APP_CONFIG = {
  // Add any other app-wide configurations here
};

module.exports = {
  API_CONFIG,
  APP_CONFIG
}; 