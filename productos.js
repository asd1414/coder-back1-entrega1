

import express from "express"
import fs from "fs"

const app = express()
const port = 8080
const archivo = "productos.json"


// muestra lista de productos
app.get("/productos", (request, response) => {
  fs.readFile(archivo, "utf-8", (error, contenido) => {
    const productos = JSON.parse(contenido)
    response.send(productos)
  })
})


//muestra producto por su id
app.get("/:pid", (request, response) => {

  const id = request.params.pid
  fs.readFile(archivo, "utf-8", (error, contenido) => {
    const productos = JSON.parse(contenido)
    const producto = productos.find(item => item.id == id)
    if (producto) {
       response.send(producto)
    } else {
        response.send({
        estado: "Error",
        mensaje: "no se encuentra el producto buscado"
      })
    }
  })


})


//agrega producto
app.post("/api/productos", (request, response) => {
    request.body
    const nuevoProducto ={id: productos.length +1, title, description, code, price, status, stock, category, thumbnails}
    productos.push (nuevoProducto)
response.status(201).json(nuevoProducto)
})


app.put("/",(response,request) =>{

})


app.delete("/",(response,request) =>{

})





app.listen(port, () => {
  console.log("active server: " + port)
})

