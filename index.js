const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/conn')

const app = express()

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

// Configurações para ser possivel pegas dados do body da requisição
app.use(
    express.urlencoded({
        extended: true,
    }),
)
app.use(express.json())

app.use(express.static('public'))

app.get('/', function (req, res) {
    res.render('home')
})

// Preparando o POST para o banco de dados
app.post('/books/insertbook', function (req, res) {
    const title = req.body.title
    const pageqty = req.body.pageqty

    const sql = `INSERT INTO books (??, ??) VALUES (?, ?)` // colunas: ?? | dados: ?
    const data = ['title', 'pageqty', title, pageqty]

    pool.query(sql, data, function (err) {
        if (err) {
            console.log(err)
            return
        }

        res.redirect('/books')
    })
})

// Rota que retorna todos os books
app.get('/books', (req, res) => {
    const sql = "SELECT * FROM books"

    pool.query(sql, function (err, data) {
        if (err) {
            console.log(err)
            return
        }
        const books = data

        res.render('books', { books })
    })
})

// Rota que retorna cada livro individualmente
app.get('/books/:id', (req, res) => {
    const id = req.params.id

    const sql = `SELECT * FROM books WHERE ?? = ?` // colunas: ?? | dados: ?
    const data = ['id', id]

    pool.query(sql, data, function (err, data) {
        if (err) {
            console.log(err)
            return
        }
        const book = data[0]

        res.render('book', { book })
    })

})

app.get('/books/edit/:id', (req, res) => {
    const id = req.params.id

    const sql = `SELECT * FROM books WHERE ?? = ?`
    const data = ['id', id]

    pool.query(sql, data, function (err, data) {
        if (err) {
            console.log(err)
            return
        }
        const book = data[0]

        res.render('editbook', { book })
    })
})

app.post('/books/updatebook', (req, res) => {
    const id = req.body.id
    const title = req.body.title
    const pageqty = req.body.pageqty

    const sql = `UPDATE books SET ?? = ?, ?? = ? WHERE ?? = ?`
    const data = ['title', title, 'pageqty', pageqty, 'id', id]

    pool.query(sql, data, function(err){
        if(err){
            console.log(err)
            return
        }
        res.redirect('/books')
    })
})

app.post('/books/remove/:id', (req, res) =>{
    const id = req.params.id

    const sql = `DELETE FROM books WHERE ?? = ?`
    const data = ['id', id]

    pool.query(sql, data, function(err){
        if(err){
            console.log(err)
            return
        }

        res.redirect('/books')
    })
})

app.listen(3000)

// Criando a conexão com o banco de dados MySQL
// const conn = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'nodemysql',
// })

// // Executando a conexão com o BD
// conn.connect(function (err) {
//     if (err) {
//         console.log(err)
//     }

//     console.log('Conectado ao MySQL!')

//     app.listen(3000)
// })
