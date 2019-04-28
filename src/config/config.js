process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';
process.env.SENDGRIP_API_KEY = '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';

let urlDB
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/cursoNode';
}
else {
  urlDB = 'mongodb+srv://amachadoa:E0gccApWueaqTZdh@cluster0-lp8w1.mongodb.net/cursoNode?retryWrites=true'
}

process.env.URLDB = urlDB;
