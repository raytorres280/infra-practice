package dao

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func Migrate() {
	var dsn = os.Getenv("RDS_CONNECTION_STRING")
	print((dsn))
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("error loading .env file")
	}
	dsn = os.Getenv("RDS_CONNECTION_STRING")
	// dsn := "root:root@tcp(127.0.0.1:3306)/api"
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
