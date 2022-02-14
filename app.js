const express = require("express")
const { randomUUID } = require("crypto")
const { request, response } = require("express");
const fs = require("fs")

const app = express()

app.use(express.json())

let products = []

function saveProducts() {
    fs.writeFile("products.json", JSON.stringify(products), (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("Produto inserido")
        }
    })
}

fs.readFile("products.json", "utf-8", (err, data) => {
    if (err) {
        console.log(err)
    } else {
        products = JSON.parse(data)
    }
})

app.get("/products", (request, response) => {
    return response.json(products)
})

app.get("/products/:id", (request, response) => {
    const { id } = request.params;
    const product = products.find(product => product.id === id)
    return response.json({ product })
})

app.post("/products", (request, response) => {
    const { name, price } = request.body
    const product = {
        name,
        price,
        id: randomUUID()
    }
    products.push(product)
    saveProducts();
    return response.json(product)
})

app.put("/products/:id", (request, response) => {
    const { id } = request.params
    const { name, price } = request.body
    const productIndex = products.findIndex(product => product.id === id)
    products[productIndex] = {
        ...products[productIndex],
        name,
        price
    }
    saveProducts()
    return response.json({ message: "Produto alterado com sucesso" })
})

app.delete("/products/:id", (request, response) => {
    const { id } = request.params
    const productIndex = products.findIndex((product) => product.id === id)
    products.splice(productIndex, 1)
    saveProducts()
    return response.json({ message: "Produto removido com sucesso" })
})

app.listen(4002, () => console.log("Servidor está rodando na prota 4002"))
