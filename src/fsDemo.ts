import fs from "fs/promises"; // NOTE: this is how we work with files


// readFile() - callback
//fs.readFile("./text.txt", 'utf8', (err, data) => {
//	if (err) throw err;
//	console.log(data)
//});
//
//// readfFilSnc
//const data = fs.readFileSync('./text.txt', 'utf8')
//console.log(data)


// readfile promis.then
// NOTE: using await is better with try catch
fs.readFile('./text.txt', 'utf8')
	.then((data) => console.log(data))
	.catch((err) => console.log(err))



