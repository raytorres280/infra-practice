package dao

import "gorm.io/gorm"

type Todo struct {
	gorm.Model
	Id        int
	Title     string
	Category  Category
	UserEmail string
	UserName  string
}

type Category int

const (
	Groceries Category = iota
	Tasks
	Appointments
)
