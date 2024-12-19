package handlers

import (
	"backend/database"
	"backend/models"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

func GenerateJWT(user models.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func GoogleLogin(w http.ResponseWriter, r *http.Request) {
	var body models.GoogleLoginRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Println(body.Avatar)
	fmt.Println(body.Name)
	fmt.Println(body.Email)

	user, err := database.GetUserByEmail(body.Email)
	if err != nil {
		newUser := models.User{
			Name:  body.Name,
			Email: body.Email,
		}
		if err := database.CreateUser(newUser); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		user = newUser
	}
	token, err := GenerateJWT(user)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}
	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    token,
		Expires:  time.Now().Add(72 * time.Hour), // Match the token expiration
		HttpOnly: true,                           // Prevents JavaScript access
		Secure:   false,                          // Ensure it's only sent over HTTPS
		SameSite: http.SameSite(0),               // Adjust based on your requirements
		Path:     "/",                            // Cookie is valid for the entire site
	})

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

func CurrentUser(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("auth_token")
	if err != nil {
		fmt.Println("cookie not found")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	token, err := jwt.Parse(cookie.Value, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID := claims["user_id"].(string)
		user, err := database.GetUserByID(userID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(user)
	}
}

func Logout(w http.ResponseWriter, r *http.Request) {
	// Clear the auth_token cookie by setting its expiration time to the past
	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    "",
		Path:     "/",              // Ensure the path matches the one used during login
		Expires:  time.Unix(0, 0),  // Set expiration to the Unix epoch
		MaxAge:   -1,               // Instructs the browser to delete the cookie immediately
		HttpOnly: true,             // Prevents JavaScript access to the cookie
		Secure:   false,            // Set to true in production to ensure HTTPS transmission
		SameSite: http.SameSite(0), // Adjust based on your security requirements
	})

	w.WriteHeader(http.StatusOK)
	response := map[string]string{"message": "Logged out successfully"}
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to send logout confirmation", http.StatusInternalServerError)
		return
	}
}
