#!/usr/bin bash
echo "Builder and Deployer 0.4.0 copyright Kuest.co"
pwd
if [ -d "dist" ]
    then
    echo "Preparing for a clean build..."
    rm -rf dist
    echo "Cleanup Done"
else
echo "Project looks clean. Continuing..."
fi
npm i 
ng config -g cli.warnings.versionMismatch false
ng build --prod
if [ -d "dist" ] 
    then 
    echo " Build Successful!"
    else
    echo "Something might be wrong. Build failed. "
fi
if [ -d "dist" ]
    then
    pwd
    echo "Deploying to the Prod environment..."
    aws s3 rm s3://chesswin-front --profile chess-win-prod --recursive
    aws s3 cp dist/chesswin-web s3://chesswin-front --profile chess-win-prod --recursive --region us-east-1 --acl public-read
    else
    echo "Something might be wrong. Deploy failed."
fi

if [ -d "dist" ]
    then
    pwd
    echo "Refreshing the CloudFront Cache"
    aws cloudfront create-invalidation --profile chess-win-prod --distribution-id E344PEL46TS2RC --paths "/*"
    echo "CloudFront Cache Updated!"
    echo "Chess-win.com is live and updated*"
    else
    echo "Something might be wrong. CloudFront Refreshing failed... "
fi
