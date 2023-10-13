package routes

import (
	"api/dao"
	"api/repositories"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

func GetTodos(c *gin.Context) {
	arr := []dao.Todo{
		{Title: "test", Category: dao.Tasks, UserEmail: "test@aol.com", UserName: "tommypickles"},
		{Title: "title 2", Category: dao.Appointments, UserEmail: "boobie@aol.com", UserName: "boobie"},
		{Title: "milk", Category: dao.Groceries, UserEmail: "mom@aol.com", UserName: "mamadukes321"},
	}
	c.JSON(http.StatusOK, arr)
}

func GetTodo(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "getTodo",
	})
}

func CreateTodo(c *gin.Context) {
	// temp := c.Copy().Params
	var todo dao.Todo
	if err := c.ShouldBindBodyWith(&todo, binding.JSON); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
	}
	// print(temp)
	repo, err := repositories.NewTodosRepository()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
	}

	result, err := repo.CreateTodo(todo)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"todo": result,
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
