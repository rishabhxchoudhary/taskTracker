To secure your backend service on an AWS EC2 Ubuntu instance with HTTPS without using a custom domain, you can follow a similar approach to the one outlined in Anuj's blog. We'll use **Caddy** as a reverse proxy and **nip.io** for DNS mapping. Here's a step-by-step guide tailored for Ubuntu:

### **Prerequisites**

1. **Ubuntu EC2 Instance**: Ensure you have an Ubuntu EC2 instance running.
2. **Backend Service**: Your backend service is running on port `8000`.
3. **Security Group Configuration**: Ensure your EC2 instance's security group allows inbound traffic on ports `80` (HTTP) and `443` (HTTPS).

### **Step 1: Update and Install Necessary Packages**

First, SSH into your EC2 instance and update your package lists:

```bash
sudo apt update && sudo apt upgrade -y
```

### **Step 2: Install Caddy**

Caddy is a powerful, easy-to-use web server with automatic HTTPS capabilities.

#### **a. Add Caddy’s Official Repository**

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo apt-key add -
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
```

#### **b. Install Caddy**

```bash
sudo apt update
sudo apt install caddy -y
```

### **Step 3: Configure Firewall (Optional but Recommended)**

If you have `ufw` (Uncomplicated Firewall) enabled, allow necessary ports:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8000/tcp
sudo ufw enable
```

### **Step 4: Configure Caddy as a Reverse Proxy**

We'll set up Caddy to handle HTTPS and proxy requests to your backend service on port `8000`.

#### **a. Create or Modify the Caddyfile**

Caddy’s configuration file is typically located at `/etc/caddy/Caddyfile`. Open it with your preferred text editor:

```bash
sudo nano /etc/caddy/Caddyfile
```

#### **b. Add the Following Configuration**

Replace `YOUR_EC2_PUBLIC_IP` with your actual EC2 instance's public IP address.

```caddy
YOUR_EC2_PUBLIC_IP.nip.io {
    reverse_proxy localhost:8000
}
```

**Example:**

If your EC2 public IP is `13.200.222.23`, the Caddyfile entry will be:

```caddy
13.200.222.23.nip.io {
    reverse_proxy localhost:8000
}
```

**Explanation:**

- **`YOUR_EC2_PUBLIC_IP.nip.io`**: `nip.io` is a wildcard DNS service that maps `YOUR_EC2_PUBLIC_IP.nip.io` to `YOUR_EC2_PUBLIC_IP`. This allows Caddy to obtain a TLS certificate without needing a custom domain.
- **`reverse_proxy localhost:8000`**: This tells Caddy to proxy incoming requests to your backend service running on port `8000`.

#### **c. Save and Exit**

Press `CTRL + O` to save and `CTRL + X` to exit the editor.

### **Step 5: Restart Caddy to Apply Changes**

```bash
sudo systemctl restart caddy
```

### **Step 6: Verify HTTPS Configuration**

1. Open your browser and navigate to:

   ```
   https://YOUR_EC2_PUBLIC_IP.nip.io/api/healthcheck
   ```

   **Example:**

   ```
   https://13.200.222.23.nip.io/api/healthcheck
   ```

2. You should see your API's health check response, and the connection should be secured with HTTPS.

### **Step 7: (Optional) Enable Caddy to Start on Boot**

Caddy is typically set up to start on boot by default. However, to ensure it's enabled:

```bash
sudo systemctl enable caddy
```

### **Additional Tips**

- **DNS Caching**: Sometimes, DNS changes might take a moment to propagate. If you encounter issues, try flushing your DNS cache or accessing the URL in an incognito/private window.
  
- **Custom Domain**: If you decide to use a custom domain in the future, you can update the Caddyfile accordingly and manage DNS settings through your domain registrar.

- **Monitoring Caddy Logs**: To troubleshoot any issues, monitor Caddy’s logs:

  ```bash
  sudo journalctl -u caddy --no-pager | less
  ```

### **Conclusion**

By following these steps, you've successfully secured your backend service with HTTPS using Caddy and nip.io on an Ubuntu EC2 instance without needing a custom domain. This setup ensures that your API endpoints are accessible securely over the internet.

Feel free to reach out if you encounter any issues or have further questions!