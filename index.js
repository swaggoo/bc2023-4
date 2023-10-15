const http = require('http');
const fs = require('fs');
const xml = require('fast-xml-parser');

const port = 5500;

function handleRootRequest(req, res) {
    if (req.url === '/') {
        const xmlData = fs.readFileSync('data.xml', 'utf8');
        const objData = convertXmlToArray(xmlData);
        const handledData = handleData(objData);

        sendXmlResponse(res, handledData);
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
}

function convertXmlToArray(xmlData) {
    const xmlParser = new xml.XMLParser();
    const parsedData = xmlParser.parse(xmlData);

    return parsedData.indicators.inflation;
}

function handleData(arr) {
    const data = arr.filter(item => item.ku === 13 && parseFloat(item.value) > 5)
        .map(item => ({ value: item.value }));

    return data;
}

function sendXmlResponse(res, obj) {
    const valuesXml = obj.map(item => `<value>${item.value}</value>`).join('');
    const xmlString = `<data>${valuesXml}</data>`;

    res.setHeader('Content-Type', 'application/xml');
    res.end(xmlString);
}

const server = http.createServer(handleRootRequest);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
