# easy-timelapse
Make beautiful 3D print timelapse videos using your phone camera or web camera and computer connected to 3D printer USB port. No any extra hardware required

Tested with Prusa MINI+ printer, phone camera and server with macOS and Linux operating systems

## Installation
Supported operating systems for launching server: Linux, macOS
There are 2 options for running server: using docker or launching nodejs server directly

For both options you need to create .env file with following variables:
**PORT** - port on which server will be listening for incoming connections  
**SESSION_ID** - identifier of the printing session that should be recorded  
**DEVICE_NAME** - name of the unix device that represents printer USB port  
How to find printer USB port name:  
Check current devices
```bash
ls -l -t /dev/tty*
```
example output:
```
crw--w----  1 username  tty    0x10000015 Jun 18 22:39 /dev/ttys011
crw--w----  1 username  tty    0x10000017 Jun 18 22:16 /dev/ttys012
crw--w----  1 username  tty    0x1000000f Jun 18 22:16 /dev/ttys013
. . .
```
Then connect printer USB cable and check devices again. The new device in the list is the printer USB port  
example device path: `/dev/ttyACM0`  
in this case, `ttyACM0` is the **DEVICE_NAME** value  

Optional variables:  
**HTTP_SERVER_PORT** - port on which http server will be listening for incoming connections. Default: `8080`  
**HTTP_SERVER_HOST** - host on which http server will be listening for incoming connections. Default: `0.0.0.0`  
**SIGNAL_SOURCE** - source of the signal that will be used to trigger camera.  
Can be either `serial-port` (default, looking for signal from printer) or `process-input` (for debugging, looking for signal from process stdin)  
Example configuration can be found in example.env

Clone repository, go to the project directory and choose one of the following options:

### Run server using docker
Docker is a software that use OS-level virtualization to deliver software in packages called containers  
Install [docker](https://docs.docker.com/engine/install/)

Build docker image
```bash
docker build --tag easy-timelapse .
```

Run docker container (replace <device name> with your printer USB port device name that was found in previous step)
```bash
docker run \
    --device=/dev/<device name> \
    --volume $(pwd)/tmp:/app/tmp \
    --publish 8080:8080 \
    --env-file .env \
    --name easy-timelapse-local \
    --interactive \
    easy-timelapse
```

Command to stop server
```bash
docker stop easy-timelapse-local
```

Command to start server
```bash
docker start easy-timelapse-local
```

### Run server directly
Install [nodejs](https://nodejs.org/en/download) 18 or higher  
Install dependencies
```bash
npm install
```
Generate self-signed ssl certificates
```bash
openssl req -x509 -newkey rsa:4096 -keyout ./server/certs/key.pem -out ./server/certs/cert.pem -days 365 -nodes -subj "/C=XX/ST=StateName/L=CityName/O=CompanyName/OU=CompanySectionName/CN=CommonNameOrHostname"
```
Start server
```bash
npm run start
```

## Usage

### Preparing the G-code
The best way how to create fluid timelapse is to take a picture after each layer, at the same position  
It can be achieved by adding a piece of custom code to every layer change  
In PrusaSlicer, go to Printer Settings -> Custom G-code -> After layer change G-code  
Example code can be found in examples project directory  
For Prusa printers, it's impossible to use [M118](https://marlinfw.org/docs/gcode/M118.html) command for printing into serial port is not supported. Workaround - put the non-existent command and use the error message as a signal that indicates layer change

### Connect camera
After starting server, check logs, it should print something like this:
```
2023-06-18 21:02:42.924+0300 - info - Visit https://192.168.10.101:8080 on device that is connected to the same network as this server in case you want to use its camera
```
Follow this instruction, open printed URL in browser on device that should be used as camera  
If you're using docker, server won't be able to get IP address of the host machine, so you need to find it in another way  
There are many ways to do it. One of them - install `ifconfig` utility, run it and check the output. Local network IP address usually starts with `192.168.`  
Since this server uses self-signed ssl certificate, you will be warned about it, you can ignore this warning and proceed to the website  
Click to the "Camera" link to enter the camera page  
On the "Camera" page, allow camera access
Once connection indicator in the top right corner becomes green, camera is ready to use

You can make test photos by setting SIGNAL_SOURCE to `process-input` in .env file (See "Installation" section, SIGNAL_SOURCE variable description). After changing config variable, restart server. Write `photo` in the process stdin and press enter

Photos should appear in the tmp/images/<SESSION_ID name> directory

### Monitor printer logs
All the logs from printer will be printed in the tmp/output.log file

### Create video
Example command for creating video from images using [ffmpeg](https://ffmpeg.org/):
```bash
ffmpeg -framerate 30 -pattern_type glob -i 'tmp/images/<SESSION_ID name>/*.png' -c:v libx264 -pix_fmt yuv420p out.mp4
```
