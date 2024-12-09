const express = require('express');
const app = express();

app.use(express.static('public'));  
app.use("/2016",express.static('public/photoalbum/photos.2016')); 
app.use("/2017",express.static('public/photoalbum/photos.2017')); 

app.get('/',(req,res) => {
    res.render('index.html');
})

const server = app.listen(process.env.PORT || 3000, () => { // https://www.quora.com/Why-is-port-3000-used-when-running-a-Node-js-application
    const port = server.address().port;
    console.log(`Server is listening at port ${port}`); 
});
