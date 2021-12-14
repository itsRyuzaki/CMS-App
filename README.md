# CMS-App
Application to manage clinical patient records

## Tools Required
- Git
- Node.js version - 16.13.0
- npm - 8.1.4
- Mongo - 5.0
## Getting Started

- Run npm install after cloning the repository on your machine
- Spin up the mongod server(needed only once)
- After the server is running start the batch file attatched (start-app.bat)
- CMS-App runs on -> http://127.0.0.1:4200/ by default

## Release Notes:
### RELEASE 1.0.0
- Pending Items
    - Constraints in mongoose models
    - Image support in forms
    - Logging in backend server
- Known Issues
    - Hamburger not working for smaller screens
        - Issue: JS files not added for bootstrap, popper
    - no Validation on dates
        - Issue: Follow up should be greater or equal to visit date
    - Intermittently categoryConfig is empty in session
## Common Issues:
- Port issue -> check ipconfig(take ipv4) and use <ng serve --host Ipv4 Address>