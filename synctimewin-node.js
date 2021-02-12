const http = require('http');
const { exec } = require('child_process');

function getDateTime(callback){
	//https://stackoverflow.com/questions/18581483/how-to-do-repeated-requests-until-one-succeeds-without-blocking-in-node
	//https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
	http.get('http://worldtimeapi.org/api/ip', (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
		data += chunk;
	  });
	  resp.on('end', () => {
		//console.log(`date ${date} & time ${time}`)
		callback(data);
	  });

	}).on("error", (err) => {
	  console.log("Error: " + err.message);
	  getDateTime(callback);
	});
}

getDateTime(function(resp) {
	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
	let datetime=new Date(JSON.parse(resp).datetime);
	let datetemp=datetime.toLocaleDateString('en-GB',{year: 'numeric', month: 'numeric', day: 'numeric'});
	let date=datetemp.replace(new RegExp("/", 'g'), "-");
	let time=datetime.toLocaleTimeString()
	
	exec(`cmd /c date ${date} & time ${time}`, (err, stdout, stderr) => {
		if (err) {
			console.log(`stderr: ${stderr}`);
			return;
		}
	});
});