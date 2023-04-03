# To Run (Local):

Make sure pg is at version 8.10.0 or everything will break
npm install
nodemon start

# To Run (Docker):

docker build -f Dockerfile -t server .
docker run -it -p 5001:5001 server