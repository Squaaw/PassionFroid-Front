# PassionFroid-Front

## How to run the application
To run the application, you need to install packages first with the command line below
```
npm install
```

After that, you could run the project with
```
npm start
```
## Deploy angular app in azure
Create a resources group (myGroup)

Create a static web app

Link your azure app to your Github Account (CI/CD)

the app_location path of workflow file (YAML) should equal to "/"

the output_location is relative to the build app. It should be equal to "dist/appName" (appName is the name of your angular app)

Important ! : If error of maximum size limit, change the limit to the angular.json file
```
“budgets“: [
    {
      "type": "initial",
      "maximumWarning": "500kb",
      "maximumError": "1mb"
    },
    {
     "type": "anyComponentStyle",
     "maximumWarning": "500kb",
     "maximumError": "1mb"
    }
]
```