var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "123Edward",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    menueOption();
});





// Functions

menueOption = () => {

    inquirer
        .prompt({
            name: "menueOptions",
            type: "list",
            message: "Menue options: ",
            choices: [
                " * View Products for Sale",
                " * View Low Inventory",
                " * Add to Inventory",
                " * Add New Product",
                " * exit"
            ]
        })
        .then(function (answer) {
            switch (answer.menueOptions) {
                case " * View Products for Sale":
                    productForSale();
                    break;

                case " * View Low Inventory":
                    lowInventory();
                    break;

                case " * Add to Inventory":
                    addToInventory();
                    break;

                case " * Add New Product":
                    addNewProduct();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}


productForSale = () => {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            let productList = []
            productList.push("***" + results[i].item_id + "    " + results[i].product_name + "    Price: " + results[i].price + "    Quantity: " + results[i].stock_quantity);
            console.log(productList);
        }
        connection.end();
    });
}

lowInventory = () => {
    var query = connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        let counter = 0;
        for (let i = 0; i < results.length; i++) {
            let stockQuantity = results[i].product_name;
            if (results[i].stock_quantity < 5) {
                counter++;
                console.log("          ----------     " + stockQuantity + "     ***an inventory count lower than five***")
            }
        }
        if (counter == 0) {
            console.log("          ---------- No itme quantity is less than five in inventory ----------          ");
        }
        connection.end();
    });
}

addToInventory = () => {
    var query = connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "itemToBeAdded",
                    type: "list",
                    message: "Which item of the inventory you would like to add more?",
                    choices: productListFunction = () => {
                        let productList0 = []
                        for (let i = 0; i < results.length; i++) {
                            productList0.push(results[i].product_name);
                        }
                        return productList0;
                    }
                },
                {
                    name: "unitsOfProduct",
                    type: "input",
                    message: "how many units of the product you would like to add?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function (answer) {
                //console.log(answer.itemToBeAdded);
                console.log(answer);
                let set0 = answer.itemToBeAdded;
                var firstQuantity = 0;
                for(let i = 0; i < results.length; i++){
                    if(results[i].product_name === answer.itemToBeAdded){
                        firstQuantity = parseInt(results[i].stock_quantity);
                        var where0 = parseInt(answer.unitsOfProduct) + firstQuantity;
                    }
                }

                
                    console.log("Updating the product quantities...\n");
                    var query = connection.query(
                      "UPDATE products SET ? WHERE ?",
                      [
                        {
                          stock_quantity: where0
                        },
                        {
                          product_name: set0
                        }
                      ],
                      function(err, res) {
                        console.log(res.affectedRows + " products updated!\n");
                        // Call deleteProduct AFTER the UPDATE completes
                        connection.end();
                    }
                    );
                  
                    // logs the actual query being run
                    console.log(query.sql);
                  


            })
    });
}

addNewProduct = () => {
            connection.query("SELECT * FROM products", function (err, results) {
                if (err) throw err;

                inquirer
                    .prompt([
                        {
                            name: "productName0",
                            type: "input",
                            message: "What is the product name?",
                        },
                        {
                            name: "departmentName0",
                            type: "input",
                            message: "What is the department name?",
                        },
                        {
                            name: "price0",
                            type: "input",
                            message: "What is the price?",
                        },
                        {
                            name: "stockQuantity0",
                            type: "input",
                            message: "What is the stock_quantity?",
                        },
                    ])
                    .then(function (answer) {
                        console.log("Inserting a new product...\n");
                        var query = connection.query(
                            "INSERT INTO products SET ?",
                            {
                                product_name: answer.productName0,
                                department_name: answer.departmentName0,
                                price: answer.price0,
                                stock_quantity: answer.stockQuantity0
                            },
                            function (err, res) {
                                console.log(res.affectedRows + " product inserted!\n");
                                // Call updateProduct AFTER the INSERT completes
                                //updateProduct();
                                connection.end();
                            }
                        );
                    })

                // logs the actual query being run
                //console.log(query.sql);
            })
        }