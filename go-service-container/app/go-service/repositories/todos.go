package repositories

import (
	"api/dao"

	"gorm.io/gorm"
)

type TodosRepository struct {
	db *gorm.DB
}

func NewTodosRepository(db *gorm.DB) TodosRepository {
	return TodosRepository{db: db}
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
