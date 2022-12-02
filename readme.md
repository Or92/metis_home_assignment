# installation:
- clone the repo
- cd into the repo
- generate .env file and set the following values in within the file:

```
DB_HOST=
DB_NAME=
DB_USER=
DB_PORT=
DB_PASSWORD=
PORT=
```

- in case you want to run it locally:
    - ```npm start``` 
- otherwise:
    - ```docker build -t metis:1.0.0 .```
    - ```docker run -p 49160:3000 metis:1.0.0```

### notes:
- in case you containerize the app, make sure the port provided in within the env file and this used for running the container are identical.
