# Docker image to get all Firestore data

## SETUP

### ENV
Copy the *.env.example* file and fill the vars


### Docker
1. Install docker
2. set your docker user


### AWS
1. Install aws cli
2. set your aws user
```
  aws configure
```


## Docker Image
1. Retrieve an authentication token and authenticate your Docker client to your registry
```
  aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 846763053924.dkr.ecr.us-west-2.amazonaws.com/covid-mindsdb
```
2. Build your Docker image using the following command
```
  docker build -t covid-mindsdb .
```
3. After the build completes, tag your image so you can push the image to this repository
```
  docker tag covid-mindsdb:latest 846763053924.dkr.ecr.us-west-2.amazonaws.com/covid-mindsdb:latest
```
4. Run the following command to push this image to your AWS repository
```
  docker push 846763053924.dkr.ecr.us-west-2.amazonaws.com/covid-mindsdb:latest
```


## Other steps

### Remove LOCAL Docker Images
1. check images
```
  docker images -a
```
2. 
```
  docker rmi $(docker images -a -q)
```
3. 
```
  docker images purge
```
