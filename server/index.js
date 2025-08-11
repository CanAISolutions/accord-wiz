import app from './app.js';

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
});


