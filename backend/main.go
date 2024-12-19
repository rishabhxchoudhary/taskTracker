package main

import (
	"backend/router"
	"fmt"
	"log"
	"net/http"
)

func main() {
	r := router.NewRouter()

	port := "8000"
	fmt.Printf("Starting server on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
