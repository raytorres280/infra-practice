package dao

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func Migrate() {
	// dsn := os.Getenv("RDS_CONNECTION_STRING")
	dsn := "root:root@tcp(127.0.0.1:3306)/api"
	// mysql.New()
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	// todo := dao.Todo{}
	if err != nil {
		println(err.Error())
	}
	migrateErr := db.AutoMigrate(&Todo{})
	if migrateErr != nil {
		println(migrateErr.Error())
	}
}
