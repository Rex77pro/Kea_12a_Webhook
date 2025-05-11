import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';
import { addWebhook, removeWebhook, listWebhooksByEvent } from './db.js';
import { ALL_EVENT_TYPES } from './events.js';
import { error } from 'console';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Webhook-service kører!')
})

app.post('/webhooks/register', async (req, res) => {
    console.log('--- /webhooks/register called ---');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    const { url, event_type } = req.body;
    if (!url || !ALL_EVENT_TYPES.includes(event_type)) {
        return res.status(400).json({ error: 'Invalid url or event_type'});
    }
    try {
        const id = await addWebhook(url, event_type);
        res.status(201).json({ id, url, event_type});
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Database error'});
    }
});

app.delete('/webhooks/:id', async (req, res) => {
  try {
    const deletedCount = await removeWebhook(req.params.id);
    if (!deletedCount) {
      return res.status(404).json({ error: 'Webhook not found' });
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/ping', async (req, res) => {
  const { event_type, data } = req.body;
  if (!ALL_EVENT_TYPES.includes(event_type)) {
    return res.status(400).json({ error: 'Unknown event_type' });
  }
  try {
    const hooks = await listWebhooksByEvent(event_type);
    await Promise.all(
      hooks.map(hook =>
        fetch(hook.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_type, data }),
        }).catch(err => console.error(`Ping failed for ${hook.url}:`, err))
      )
    );
    res.json({ delivered: hooks.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`http://localhost:${PORT}/`))