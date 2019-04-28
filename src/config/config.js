process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/cursoNode';
}
else {
  urlDB = 'mongodb+srv://amachadoa:E0gccApWueaqTZdh@cluster0-lp8w1.mongodb.net/cursoNode?retryWrites=true'
}

process.env.SENDGRID_API_KEY = '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'

process.env.URLDB = urlDB
