#!/bin/bash

cd /opt/bc-rcv-rla/SHANGRLA/2023
screen -dmS notebook pipenv run jupyter lab --ip 0.0.0.0 --no-browser --allow-root --NotebookApp.token=''

cd /opt/bc-rcv-rla/MVR
screen -dmS mvr node index.js
