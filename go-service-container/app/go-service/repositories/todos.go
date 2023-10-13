package repositories

import (
	"api/dao"
	"fmt"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type TodosRepository struct {
	db *gorm.DB
}

func NewTodosRepository() (*TodosRepository, error) {
	dsn := os.Getenv("RDS_CONNECTION_STRING")
	// dsn := "root:root@tcp(127.0.0.1:3306)/api"
	// mysql.New()
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	return &TodosRepository{db: db}, nil
}

func (repo *TodosRepository) GetTodos() ([]dao.Todo, error) {
	var todos []dao.Todo
	repo.db.Find(todos).Limit(10)
	// if todos.Error != nil {
	// 	println(todos.Error.Error())
	// }

	// return todos
	return todos, nil
}

func (repo *TodosRepository) CreateTodo(t dao.Todo) (*dao.Todo, error) {
	result := repo.db.Create(&t)
	if result.Error != nil {
		return nil, result.Error
	}

	fmt.Printf("Before the update: %v", t.ID)
	return &t, nil
}
