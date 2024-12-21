
Install git
`sudo apt install git -y`

install golang

```
wget https://go.dev/dl/go1.20.5.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.20.5.linux-amd64.tar.gz
```

```
echo "export PATH=$PATH:/usr/local/go/bin" >> ~/.profile
echo "export GOPATH=$HOME/go" >> ~/.profile
source ~/.profile
```

Install nodejs and npm
```curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Install nginx
`sudo apt install nginx -y`

```sudo systemctl start nginx
sudo systemctl enable nginx```

install pm2
`sudo npm install -g pm2`

Setting up backend
`git clone https://github.com/rishabhxchoudhary/taskTracker.git`
`cd taskTracker`
