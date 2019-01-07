How to run backend?
  - Navigate to backend directory in cmd
  - Install required dependencies using npm install
  - Run back end using npm start

How can I change port, if 5000 port is occupied?
  - Open config.js file in the backend directory
  - Change '5000' to currently available port number in line 5 ('backend_port': "5000")
  - Also change the port in variable ROOT_URL in URI.js file in frontend/src/constants folder
