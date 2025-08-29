import express, { static as _static } from 'express';
import { join } from 'node:path';

const app = express();

app.listen(3000, () => {
    console.log(`open app at http://localhost:${3000}`);
});

app.use('/node_modules', _static(join(import.meta.dirname, '..', 'node_modules')));
app.use(_static(join(import.meta.dirname, 'client')));

app.get("/", (req, res) => {
    res.sendFile(join(import.meta.dirname, 'client', 'index.html'));
});
