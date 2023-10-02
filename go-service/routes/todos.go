package routes

import (
	"api/dao"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetTodos(c *gin.Context) {
	arr := []dao.Todo{
		{Id: 1, Title: "test", Category: dao.Tasks, UserEmail: "test@aol.com", UserName: "tommypickles"},
		{Id: 2, Title: "title 2", Category: dao.Appointments, UserEmail: "boobie@aol.com", UserName: "boobie"},
		{Id: 3, Title: "milk", Category: dao.Groceries, UserEmail: "mom@aol.com", UserName: "mamadukes321"},
	}
	c.JSON(http.StatusOK, arr)
}

func GetTodo(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}

func CreateTodo(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}

func UpdateTodo(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}

func DeleteTodo(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}
