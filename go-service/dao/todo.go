package dao

type Todo struct {
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
