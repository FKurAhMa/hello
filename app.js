const express = require('express');
const mysql = require('mysql2');
const app = express();

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'mysql-javiergwee.alwaysdata.net',
    user: '371004',
    password: '1234567890ABc!',
    database: 'javiergwee_hello'
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});
// Set up view engine
app.set('view engine', 'ejs');
// enable static files
app.use(express.static('public'));

//enable form processing 
app.use(express.urlencoded({
    extended: false
}))
// Define routes
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM products';
    //Fetch data from MySQL 
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error :', error.message);
            return res.status(500).send('Error Retrieving products');
        }
        //render HTML page with data
        res.render('index', { products: results });
    });
});

//Extract the product ID from the request parameters 
app.get('/product/:id', (req,res) =>{
    const productId = req.params.id;
    const sql = 'SELECT * FROM products WHERE productId = ?';
    connection.query( sql, [productId], (error, results)=>{
        if(error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving product by ID');
        }
        // check if any product with the given ID was found 
        if (results.length > 0) {
            res.render('product', {product: results[0]});
        } else{
            res.status(404).send('Product is not found');
        }
    });
});


//add new product 
app.get('/addProduct', (req,res)=> {
    res.render('addProduct');
});

app.post('/addProduct',(req,res)=>{
    //extract product data from the request body
    const {name, quantity, price, image } = req.body;
    const sql = 'INSERT INTO products (productName, quantity, price, image) VALUES (? , ?, ?, ?)';
    //insert the new product into the database 
    connection.query( sql, [name , quantity, price, image], (error, results)=> {
        if (error){
            console.error("Error adding product:", error);
            res.status(500).send('Error adding product');
        } else {
            res.redirect('/');
        }
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));