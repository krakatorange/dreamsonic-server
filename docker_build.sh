DATABASE_URL=`aws ssm get-parameters --region us-east-1 --name "/prod/antisonnik/frontend" --query Parameters[0].Value | tr -d '"'`
DATABASE_HOST=`aws ssm get-parameters --region us-east-1 --name "/prod/antisonnik/frontend" --query Parameters[1].Value | tr -d '"'`
DATABASE_NAME=`aws ssm get-parameters --region us-east-1 --name "/prod/antisonnik/frontend" --query Parameters[2].Value | tr -d '"'`
DATABASE_USER=`aws ssm get-parameters --region us-east-1 --name "/prod/antisonnik/frontend" --query Parameters[3].Value | tr -d '"'`
DATABASE_PASSWORD=`aws ssm get-parameters --region us-east-1 --name "/prod/antisonnik/frontend" --query Parameters[4].Value | tr -d '"'`
DATABASE_PORT=`aws ssm get-parameters --region us-east-1 --name "/prod/antisonnik/frontend" --query Parameters[5].Value | tr -d '"'`
AWS_APIGATEWAY_LAMBDA_CHATGPT_API_KEY=`aws ssm get-parameters --region us-east-1 --name "/prod/antisonnik/frontend" --query Parameters[6].Value | tr -d '"'`
AWS_APIGATEWAY_LAMBDA_CHATGPT_ENDPOINT=`aws ssm get-parameters --region us-east-1 --name "/prod/antisonnik/frontend" --query Parameters[7].Value | tr -d '"'`
REACT_APP_DOMAIN=`aws ssm get-parameters --region us-east-1 --name "/prod/antisonnik/frontend" --query Parameters[8].Value | tr -d '"'`
NODE_OPTIONS=`aws ssm get-parameters --region us-east-1 --name "/prod/antisonnik/frontend" --query Parameters[9].Value | tr -d '"'`

docker buildx build --platform linux/amd64 . -t <image_tag> -f <docker_file_path> \
--build-arg DATABASE_URL=$DATABASE_URL \
--build-arg DATABASE_HOST=$DATABASE_HOST \
--build-arg DATABASE_NAME=$DATABASE_NAME \
--build-arg DATABASE_USER=$DATABASE_USER \
--build-arg DATABASE_PASSWORD=$DATABASE_PASSWORD \
--build-arg DATABASE_PORT=$DATABASE_PORT \
--build-arg AWS_APIGATEWAY_LAMBDA_CHATGPT_API_KEY=$AWS_APIGATEWAY_LAMBDA_CHATGPT_API_KEY \
--build-arg AWS_APIGATEWAY_LAMBDA_CHATGPT_ENDPOINT=$AWS_APIGATEWAY_LAMBDA_CHATGPT_ENDPOINT \
--build-arg REACT_APP_DOMAIN=$REACT_APP_DOMAIN \
--build-arg NODE_OPTIONS=$NODE_OPTIONS \
--load