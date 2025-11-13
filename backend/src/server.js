const app = require('./app');

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0'; // important for Render to access

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
