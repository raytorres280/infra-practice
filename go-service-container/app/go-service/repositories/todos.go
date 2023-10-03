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
	repo.db.Find(&dao.Todo{}).Limit(10)
}
