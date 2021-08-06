const express = require('express')
const {google} = require('googleapis');

const app = express()
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/', (request, response) =>{
    response.render('index')
})

app.post('/',  async (request, response) =>{
    const {article, author} = request.body;
    const auth = new google.auth.GoogleAuth({
        keyFile: "keys.json", 
        scopes: "https://www.googleapis.com/auth/spreadsheets", 
    });

    const authClientObject = await auth.getClient();
    
    const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });

    const spreadsheetId = "1Rhyd7R8p_S_QCD4boZkFVZqX88hYrBhLaKhZq5AdKz8";

    const sheetInfo = await googleSheetsInstance.spreadsheets.get({
        auth,
        spreadsheetId,
    });

    const readData = await googleSheetsInstance.spreadsheets.values.get({
        auth, 
        spreadsheetId, 
        range: "Sheet1!A:A", 
    })
    

    await googleSheetsInstance.spreadsheets.values.append({
        auth, 
        spreadsheetId, 
        range: "Sheet1!A:B", 
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [[article, author]]
        },
    });
    
    response.send("Request submitted.!!")
});


const PORT = 8080;

app.listen(PORT, () =>{
    console.log(`Server started on port localhost:${PORT}`);
});