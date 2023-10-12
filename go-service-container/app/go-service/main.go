package main

import (
	"api/dao"
	"api/routes"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.GET("/migrate", func(ctx *gin.Context) {
		dao.Migrate()
	})
	r.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	r.GET("/", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	r.GET("/todos", routes.GetTodos)
	r.GET("/todo/:id", routes.GetTodo)
	r.POST("/todo", routes.CreateTodo)
	r.PUT("/todo", routes.UpdateTodo)
	r.DELETE("/todo", routes.DeleteTodo)
	println("listening on port http://localhost:80")
	r.Run(":80") // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
