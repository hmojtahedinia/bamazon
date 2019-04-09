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


//Functions:

function showProducts() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        for (let i = 0; i < results.length; i++) {
            console.log(results[i]);
        }
        //console.log(results);

    })
}
showProducts();

idToBuy = () => {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "idOfProduct",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].product_name);
                        }
                        return choiceArray;
                    },
                    message: "What is the ID of the product you would like to buy?",
                },
                {
                    name: "unitsOfProduct",
                    type: "input",
                    message: "how many units of the product you would like to buy?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function (answer) {
                // when finished prompting, insert a new item into the db with that info
                for (let i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.idOfProduct) {
                        var newId = i + 1;
                        //console.log(newId);
                    }
                }

                if (newId <= results[newId - 1].stock_quantity) {
                    var unitsOfProduct0 = answer.unitsOfProduct;
                    var newQuantity = results[newId - 1].stock_quantity - answer.unitsOfProduct;
                    console.log(newQuantity);
                    if (newQuantity <= 0) {
                        console.log("Sorry! Insufficient quantity!");

                        inquirer
                            .prompt({
                                name: "question",
                                type: "list",
                                message: "Do you want to order again?",
                                choices: [
                                    "Yes",
                                    "No"
                                ]
                            })
                            .then(function (answer) {
                                // when finished prompting, insert a new item into the db with that info
                                if (answer.question === "Yes") {
                                    showProducts();
                                    idToBuy();
                                } else {
                                    connection.end();
                                }
                            })




                    } else {
                        for (let i = 0; i < results.length; i++) {
                            if (results[i].product_name === answer.idOfProduct) {
                                var newId = i + 1;
                                //console.log(newId);
                            }
                        }


                        connection.query("SELECT stock_quantity FROM products", function (err, results2) {
                            if (err) throw err;
                            //console.log(results2);
                        });



                        var query = connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: newQuantity
                                },
                                {
                                    product_name: answer.idOfProduct
                                }
                            ],
                            function (error) {
                                if (error) throw err;
                                console.log("Stock quantity updated successfully!");
                            }
                        );

                        connection.query("SELECT price FROM products", function (err, results) {
                            if (err) throw err;
                            //console.log(results[newId-1].price);
                            var finalPrice = results[newId - 1].price * unitsOfProduct0;
                            console.log("Total cost = " + finalPrice + "$");
                            connection.end();

                        })
                    }


                }

            });
    });
}
idToBuy();