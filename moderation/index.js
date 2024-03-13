const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { log } = require('console');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const status = data.content.includes('green') ? 'rejected' : 'approved';

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentModerated',
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content
      }
    });
  }


  if (type === 'PostCreated') {
    const status = data.title.includes('green') ? 'rejected' : 'approved';
    console.log(data);
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'PostModerated',
      data: {
        id: data.id,
        status,
        title: data.title
      }
    });
  }
  res.send({});
});

app.listen(4003, () => {
  console.log('Listening on 4003');
});
