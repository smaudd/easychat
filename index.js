const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // Set EJS as the template engine
app.set('views', path.join(__dirname, 'views')); // Set the 'views' directory

const dataFilePath = path.join(__dirname, 'data', 'messages.json');

// Helper function to read data from the file
function readDataFromFile() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Helper function to write data to the file
function writeDataToFile(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// Render the view with all messages and a form to create new messages
app.get('/messages', (req, res) => {
  const messages = readDataFromFile();
  res.render('messages', { messages });
});

// Save a new message
app.post('/messages', (req, res) => {
  const { sender, message } = req.body;
  if (!sender || !message) {
    return res.status(400).json({ error: 'Sender and message are required.' });
  }

  const newMessage = { sender, message };
  const messages = readDataFromFile();
  messages.push(newMessage);
  writeDataToFile(messages);

  res.redirect('/messages'); // Redirect back to the messages view
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
