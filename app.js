const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// View engine
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');


// Routes
app.get('/', (req, res) => {
  res.render('home', { title: 'PortaSpot' });
});
app.get('/about', (req, res) => {
    res.render('about', { title: 'About PortaSpot' });
  });
app.get('/services', (req, res) => {
    res.render('services', { title: 'PortaSpot Services' });
  });

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact PortaSpot' });
});

app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    console.log(name, email, message)
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    const mailOptionsToUser = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thanks for contacting us!',
      text: `Hi ${name},\n\nThanks for reaching out! We'll get back to you soon.\n\nYour message: "${message}"`,
    };
  
    const mailOptionsToOwner = {
      from: process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL,
      subject: 'New contact form submission',
      text: `New message from ${name} (${email}):\n\n${message}`,
    };
  
    try {
      await transporter.sendMail(mailOptionsToUser);
      await transporter.sendMail(mailOptionsToOwner);
  
      res.render('contact', { title: 'Contact Us', success: 'Message sent! Please check your email.' });
    } catch (err) {
      console.error(err);
      res.render('contact', { title: 'Contact Us', error: 'Email failed. Please try again later.' });
    }
});
  

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
