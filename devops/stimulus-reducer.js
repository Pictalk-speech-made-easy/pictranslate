import fs from "fs"
// Read the file
fs.readFile('output.json', 'utf8', function (err, data) {
    if (err) {
        console.error(err);
        return;
    }

    // Parse the JSON
    let obj = JSON.parse(data);

    // Modify the object
    for (let key in obj) {
        obj[key] = obj[key].map(item => {
            item.responses = item.responses.slice(0, 5);
            return item;
        });
    }

    // Convert it back to JSON
    let json = JSON.stringify(obj, null, 2);

    // Write it back to the file
    fs.writeFile('output.reduced.json', json, 'utf8', function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log('File successfully written!');
        }
    });
});