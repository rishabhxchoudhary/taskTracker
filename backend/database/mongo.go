package database

import (
    "context"
    "fmt"
    "log"
    "time"

    "github.com/joho/godotenv"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "os"
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
    host := os.Getenv("MONGODB_HOST")
    if host == "" {
        host = "localhost"
    }
    port := os.Getenv("MONGODB_PORT")
    if port == "" {
        port = "27017"
    }
    uri := fmt.Sprintf("mongodb://%s:%s", host, port)

    clientOptions := options.Client().ApplyURI(uri)
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    client, err := mongo.Connect(ctx, clientOptions)
    if err != nil {
        log.Fatal(err)
    }

    // Check the connection
    err = client.Ping(ctx, nil)
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Connected to MongoDB!")
    Client = client
}

// Example function for users, repeat similarly for projects, tasks, subtasks
func GetUserCollection() *mongo.Collection {
    return Client.Database("yourdbname").Collection("users")
}
