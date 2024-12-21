package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client

func init() {
	LoadEnv()
	ConnectDB()
}

func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using default configuration")
	}
}

func ConnectDB() {
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		uri = "mongodb://localhost:27017"
	}
	clientOptions := options.Client().ApplyURI(uri)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MongoDB!")
	Client = client
}

func GetUserCollection() *mongo.Collection {
	return Client.Database("yourdbname").Collection("users")
}
func GetProjectCollection() *mongo.Collection {
	return Client.Database("yourdbname").Collection("projects")
}

func GetTaskCollection() *mongo.Collection {
	return Client.Database("yourdbname").Collection("tasks")
}
