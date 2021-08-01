/*Test Cases
1) endpoint: GET http://localhost:8080/api/productos/listar
Resultado Esperado: Status 200
					{
    					"error": "No hay productos cargados"
					}

2) endpoint: GET http://localhost:8080/api/productos/listar/1
Resultado esperado: Status 200
					{
    					"error": "Producto no encontrado"
					}	

3) endpoint: POST http://localhost:8080/api/productos/guardar
	{
	    "title": "Producto 1",
	    "price": 100.5,
	    "thumbnail": "http://Producto1.com"
	}
Resultado esperado: Status 200
					{
						"data": {
						    "title": "Producto 1",
						    "price": 100.5,
						    "thumbnail": "http://Producto1.com",
						    "id": 1
						}
					}

4) endpoint: GET http://localhost:8080/api/productos/listar
Resultado Esperado: Status 200
					{
					    "productos": [
					        {
					            "title": "Producto 1",
					            "price": 100.5,
					            "thumbnail": "http://Producto1.com",
					            "id": 1
					        }
					    ]
					}

5) endpoint: GET http://localhost:8080/api/productos/listar/1
Resultado esperado: Status 200
					{
					    "itemId": {
					        "title": "Producto 1",
					        "price": 100.5,
					        "thumbnail": "http://Producto1.com",
					        "id": 1
					    }
					}

6) endpoint: GET http://localhost:8080/api/productos/listar/2
Resultado esperado: Status 200
					{
    					"error": "Producto no encontrado"
					}	


7) endpoint: POST http://localhost:8080/api/productos/guardar
					Sin parámetros
Resultado esperado: Status 400
					{
					    "msg": "Se necesitan los datos title, thumbnail y price"
					}

8) endpoint: POST http://localhost:8080/api/productos/guardar
	{
	    "title": "Producto 2",
	    "price": 101.5,
	    "thumbnail": "http://Producto2.com"
	}
Resultado esperado: Status 200
					{
					    "data": {
					        "title": "Producto 2",
					        "price": 101.5,
					        "thumbnail": "http://Producto2.com",
					        "id": 2
					    }
					}

9) endpoint: GET http://localhost:8080/api/productos/listar
Resultado Esperado: Status 200
					{
					    "productos": [
					        {
					            "title": "Producto 1",
					            "price": 100.5,
					            "thumbnail": "http://Producto1.com",
					            "id": 1
					        },
					        {
					            "title": "Producto 2",
					            "price": 101.5,
					            "thumbnail": "http://Producto2.com",
					            "id": 2
					        }
					    ]
					}

10) endpoint: GET http://localhost:8080/api/productos/listar/1
Resultado esperado: Status 200
					{
					    "itemId": {
					        "title": "Producto 1",
					        "price": 100.5,
					        "thumbnail": "http://Producto1.com",
					        "id": 1
					    }
					}

11) endpoint: GET http://localhost:8080/api/productos/listar/2
Resultado esperado: Status 200
					{
					    "itemId": {
					        "title": "Producto 2",
					        "price": 101.5,
					        "thumbnail": "http://Producto2.com",
					        "id": 2
					    }
					}

12) endpoint: GET http://localhost:8080/api/productos/listar/3
Resultado esperado: Status 200
					{
    					"error": "Producto no encontrado"
					}	

13) endpoint: POST http://localhost:8080/api/productos/guardar
	{
    "title": "Producto 3",
    "price": 102.5,
    "thumbnail": "http://Producto3.com"
	}
Resultado esperado: Status 200
					{
					    "data": {
					        "title": "Producto 3",
					        "price": 102.5,
					        "thumbnail": "http://Producto3.com",
					        "id": 3
					    }
					}

14) endpoint: GET http://localhost:8080/api/productos/listar
Resultado Esperado: Status 200
					{
					    "productos": [
					        {
					            "title": "Producto 1",
					            "price": 100.5,
					            "thumbnail": "http://Producto1.com",
					            "id": 1
					        },
					        {
					            "title": "Producto 2",
					            "price": 101.5,
					            "thumbnail": "http://Producto2.com",
					            "id": 2
					        },
					        {
					            "title": "Producto 3",
					            "price": 102.5,
					            "thumbnail": "http://Producto3.com",
					            "id": 3
					        }
					    ]
					}

15) endpoint: GET http://localhost:8080/api/productos/listar/1
Resultado esperado: Status 200
					{
					    "itemId": {
					        "title": "Producto 1",
					        "price": 100.5,
					        "thumbnail": "http://Producto1.com",
					        "id": 1
					    }
					}

16) endpoint: GET http://localhost:8080/api/productos/listar/2
Resultado esperado: Status 200
					{
					    "itemId": {
					        "title": "Producto 2",
					        "price": 101.5,
					        "thumbnail": "http://Producto2.com",
					        "id": 2
					    }
					}

17) endpoint: GET http://localhost:8080/api/productos/listar/3
Resultado esperado: Status 200
					{
					    "itemId": {
					        "title": "Producto 3",
					        "price": 102.5,
					        "thumbnail": "http://Producto3.com",
					        "id": 3
					    }
					}

18) endpoint: GET http://localhost:8080/api/productos/listar/4
Resultado esperado: Status 200
					{
    					"error": "Producto no encontrado"
					}

19) endpoint: PUT http://localhost:8080/api/productos/actualizar/2
	{
    	"title": "Producto 2 Modificado",
    	"price": 1022.5,
    	"thumbnail": "http://Producto2Mod.com"
	}
Resultado esperado: Status 200
					{
					    "actItem": {
					        "title": "Producto 2 Modificado",
					        "price": 1022.5,
					        "thumbnail": "http://Producto2Mod.com",
					        "id": "2"
					    }
					}

20) endpoint: GET http://localhost:8080/api/productos/listar
Resultado Esperado: Status 200
					{
					    "productos": [
					        {
					            "title": "Producto 1",
					            "price": 100.5,
					            "thumbnail": "http://Producto1.com",
					            "id": 1
					        },
					        {
					            "title": "Producto 2 Modificado",
					            "price": 1022.5,
					            "thumbnail": "http://Producto2Mod.com",
					            "id": 2
					        },
					        {
					            "title": "Producto 3",
					            "price": 102.5,
					            "thumbnail": "http://Producto3.com",
					            "id": 3
					        }
					    ]
					}				

20) endpoint: DELETE http://localhost:8080/api/productos/borrar/2
Resultado Esperado: Status 200		
					{
					    "borrItem": [
					        {
					            "title": "Producto 2 Modificado",
					            "price": 1022.5,
					            "thumbnail": "http://Producto2Mod.com",
					            "id": 2
					        }
					    ]
					}

20) endpoint: GET http://localhost:8080/api/productos/listar
Resultado Esperado: Status 200
					{
					    "productos": [
					        {
					            "title": "Producto 1",
					            "price": 100.5,
					            "thumbnail": "http://Producto1.com",
					            "id": 1
					        },
					        {
					            "title": "Producto 3",
					            "price": 102.5,
					            "thumbnail": "http://Producto3.com",
					            "id": 3
					        }
					    ]
					}
 */