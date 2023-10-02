package main

import (
	"api/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.GET("/todos", routes.GetTodos)
	r.GET("/todo/:id", routes.GetTodo)
	r.POST("/todo", routes.CreateTodo)
	r.PUT("/todo", routes.UpdateTodo)
	r.DELETE("/todo", routes.DeleteTodo)
	println("listening on port http://localhost:8080")
	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
