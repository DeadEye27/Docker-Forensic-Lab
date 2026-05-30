const express =  require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port  = 3000;

// Middleware Logging: Menyimpan log setiap aktivitas (Simulasi CloudTrail / Server Log)
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] IP: ${req.ip} | Method: ${req.method} | Path: ${req.originalUrl}\n`;

    // Menulis Log ke dalam file evidence.log di dalam container
    fs.appendFileSync('evidence.log', logEntry);
    console.log(logEntry.trim());
    next();
});

app.get('/', (req, res) => {
    res.send(`Server Backend Berjalan Normal`);
});

// VULNERABLE ENDPOINT (Celah Keamanan)
// Endpoint ini dirancang untuk membaca file dari folder 'public'
// tapi tidak memiliki validasi, sehingga rentan terhadap Path Traversal.
app.get('/api/download', (req, res) => {
    const fileName = req.query.file;
    if (!fileName) {
        return res.status(400).send(
            'Parameter file tidak ditemukan.'
        );
    }

    const filePath = path.join(__dirname, 'public', fileName);

    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        res.send(fileContent);
    } catch (err) {
        res.status(404).send('File tidak ditemukan.');
    }
});

app.listen(port, () => {
    console.log(`Server API berjalan di port ${port}`);
});