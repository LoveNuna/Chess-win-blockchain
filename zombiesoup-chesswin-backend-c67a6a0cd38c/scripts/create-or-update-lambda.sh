##### usage ---- bash deploy/create-or-update-lambda.sh lambda-name

# Set some variables to use later
FUNCTION_PACKAGE_NAME="$1-$(date +%Y%m%d-%H%M).zip"
FUNCTION_NAME=$1


# go to right director
cd ./src/$FUNCTION_NAME

# pwd

# remove old stuff 
rm -r lib

# compile & build project
webpack
cd lib

# zip it
zip -r $FUNCTION_PACKAGE_NAME *

# check if function exists, and create, otherwise update it
result=$(aws lambda list-functions --region us-east-1 --query 'Functions[?starts_with(FunctionName, `'$FUNCTION_NAME'`) == `true`].FunctionName' --output text --profile chess-win-prod --region us-east-1)

if [[ $result ]]
then
    echo "Function already's there, let's update it"
    aws lambda update-function-code --function-name $FUNCTION_NAME --zip-file fileb://$FUNCTION_PACKAGE_NAME --profile chess-win-prod --region us-east-1
else
    echo "Function does not exist, let's create it"
    aws lambda create-function \
    --function-name $FUNCTION_NAME\
    --runtime nodejs12.x\
    --role arn:aws:iam::260551469356:role/cognito-dev-admin\
    --zip-file fileb://$FUNCTION_PACKAGE_NAME\
    --handler index.handler\
    --profile chess-win-prod\
    --region us-east-1
fi
