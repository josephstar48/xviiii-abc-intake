export PROJECT_TOKEN=glpat-psikxjVK6Xc3ZU7DQxkb

sudo apt-get update
sudo apt-get -y install openjdk-17-jre-headless
sudo apt-get -y install npm
sudo npm install --global yarn

#Docker installation
sudo apt-get -y install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo docker pull postgres

git config --global user.name "Adam Andre"
git config --global user.email adam.n.andre.mil@army.mil
git config --global user.password "$PROJECT_TOKEN"
git config --global credential.helper store
echo "https://adam.n.andre.mil%40army.mil:$PROJECT_TOKEN@gitlab.vulcan.mil" > ~/.git-credentials
git clone https://gitlab.vulcan.mil/army-software-factory/product-office/sdu-2/2-4/airborne-ready/usasoc-hackathon-june-2024.git

cd usasoc-hackathon-june-2024
sudo docker compose up -d
./gradlew bootRun
