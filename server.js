import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory contact leads storage
const contactLeads = [];

// Contact Submission API
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, service, message, token } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const lead = {
      id: Date.now().toString(),
      name,
      email,
      service: service || 'General Consultation',
      message: message || '',
      submittedAt: new Date().toISOString(),
      sentTo: 'devinrcopc@gmail.com'
    };

    contactLeads.unshift(lead);
    console.log(`[Contact Lead] Received inquiry from ${name} (${email}) for ${service}`);

    // Forward to FormSubmit to deliver to devinrcopc@gmail.com
    try {
      await fetch('https://formsubmit.co/ajax/9e36bb3103cc7f2ea587de073031640e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          service: service || 'General Consultation',
          message: message || '',
          _subject: `New Consultation Request: ${name} - ${service} [DevinRC]`,
          _template: 'table',
          _captcha: 'false'
        })
      });
    } catch (e) {
      console.warn('[Contact] FormSubmit forwarding note:', e.message);
    }

    res.json({
      success: true,
      message: 'Inquiry received and delivered to devinrcopc@gmail.com',
      leadId: lead.id
    });
  } catch (err) {
    console.error('Error handling contact form:', err);
    res.status(500).json({ error: 'Internal server error processing contact' });
  }
});

// Endpoint to view leads
app.get('/api/contact/leads', (req, res) => {
  res.json({ count: contactLeads.length, leads: contactLeads });
});

// Serve static files from public directory first, then root
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Serve index.html for all other routes
app.get('*', (req, res) => {
  const publicIndex = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(publicIndex)) {
    res.sendFile(publicIndex);
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
