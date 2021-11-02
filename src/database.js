const { connect } = require('mongoose')

const conenctDB = async () => {
    try {
        const db = await connect('mongodb://localhost/tasks-db')
        console.log('DB connected!');
    }catch(err) {console.log(err);}
}

module.exports = conenctDB

