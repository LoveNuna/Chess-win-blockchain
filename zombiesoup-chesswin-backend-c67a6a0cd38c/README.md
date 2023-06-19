# chessf-backend

Chess project backend functions

To update a TypeScript function:

- go to function dir /src/function-name (ex. update-points)
- exec `npm install`
- exec `webpack`
- then to update function exec `bash ../../scripts/create-or-update-lambda.sh update-points`

To update .Net function (GameEvent)

- go to function dir /src/GameEvent/src/GameEvent
- Install Amazon.Lambda.Tools Global Tools if not already installed.

```
    dotnet tool install -g Amazon.Lambda.Tools
```

- If already installed check if new version is available.

```
    dotnet tool update -g Amazon.Lambda.Tools
```

- Deploy function to AWS Lambda

```
    dotnet lambda deploy-function
```
