package dao

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func Migrate() {
	dsn := "connectionString"
	// mysql.New()
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	// todo := dao.Todo{}
	if err != nil {
		println(err.Error())
	}
	db.AutoMigrate(&Todo{})
}
