

import express from "express"
import fs from "fs"

const app = express()
const port = 8080
const archivo = "productos.json"
const carts = "carts.json"

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Aqui cargamos los productos del JSON
const cargarProductos = () => {
  try {
    const data = fs.readFileSync(archivo, "utf-8");
    return JSON.parse(data);
  }
  catch (error) {
    console.error("Error al leer los productos")
    return []
  }
};

//Aqui guardamos en el JSON
const guardarProductos = (productos) => {
  fs.writeFileSync(archivo, JSON.stringify(productos, null, 2));
};


// muestra lista de productos
app.get("/api/products", (request, response) => {
  fs.readFile(archivo, "utf-8", (error, contenido) => {
    const productos = JSON.parse(contenido)
    response.send(productos)
  })
})


//muestra producto por su id
app.get("/api/products/:pid", (request, response) => {

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
app.post("/api/products/", (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;


  const productos = cargarProductos();
  const nuevoProducto = {
    id: productos.length + 1,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  };

  productos.push(nuevoProducto);
  guardarProductos(productos);

  res.status(201).json(nuevoProducto);
});


// actualiza un producto 
app.put("/api/products/:pid", (res, req) => {

  const { id } = req.params;
  const { title, description, code, price, status, stock, category, thumbnails } = req.body

  fs.readFile(archivo, "utf-8", (error, contenido) => {
    if (error) {
      console.error("Error al leer el archivo:", error);
      return response.status(500).send("Error al leer los productos.");
    }

    const productos = JSON.parse(contenido);
    const indiceProducto = productos.findIndex(item => item.id == id);

    if (indiceProducto === -1) {
      return response.status(404).send({ estado: "Error", mensaje: "Producto no encontrado." });
    }

    const productoActualizado = {
      ...productos[indiceProducto],
      title: title !== undefined ? title : productos[indiceProducto].title,
      description: description !== undefined ? description : productos[indiceProducto].description,
      code: code !== undefined ? code : productos[indiceProducto].code,
      price: price !== undefined ? price : productos[indiceProducto].price,
      status: status !== undefined ? status : productos[indiceProducto].status,
      stock: stock !== undefined ? stock : productos[indiceProducto].stock,
      category: category !== undefined ? category : productos[indiceProducto].category,
      thumbnails: thumbnails !== undefined ? thumbnails : productos[indiceProducto].thumbnails
    };

    productos[indiceProducto] = productoActualizado;

    fs.writeFile(archivo, JSON.stringify(productos, null, 2), (err) => {
      if (err) {
        console.error("Error al guardar el archivo:", err);
        return response.status(500).send("Error al guardar los productos.");
      }

      response.status(200).json(productoActualizado);
    });
  });
});


app.delete("/api/products/:pid", (response, request) => {

})



// muestra lista del carrito
app.get("/api/carts/", (request, response) => {
  fs.readFile(carts, "utf-8", (error, contenido) => {
    const carts = JSON.parse(contenido)
    response.send(carts)
  })
})








app.listen(port, () => {
  console.log("active server: " + port)
})

