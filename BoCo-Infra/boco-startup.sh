#!/bin/bash

echo ""
echo "Starting screened sessions for BCCR RCV-RLA Jupyter Notebook and MVR Website."
echo ""

if [ ! -d "/rcv-data/bccr" ]
then
    echo "Expected volume mount directory /rcv-data/bccr not found. Exiting."
    exit 1
fi

cd /opt/BoCo-RCV-RLA/SHANGRLA/2023
screen -L -Logfile /rcv-data/console-log-notebook.log -dmS notebook pipenv run jupyter lab --ip 0.0.0.0 --no-browser --allow-root --NotebookApp.token=''

cd /opt/BoCo-RCV-RLA/MVR
screen -L -Logfile /rcv-data/console-log-mvr.log -dmS mvr node index.js

sleep 3
echo ""
echo "List of running screens - should include a nnnnn.notebook and nnnnn.mvr screen..."
echo ""
screen -ls
echo ""
echo ""
echo "If you see two screens above, you should be able to access the Jupyter Notebook and MVR tools as follows:"
echo " * Jupyter Notebook: http://localhost:8888/"
echo " * MVR Marking Tool: http://localhost:8887/"
echo ""
echo "Note that while these use http, all traffic/access is on the local system (no data is passed in cleartext over the network)."
echo "To connect to and manage a screen or to see session output:"
echo " * Use the session ID or name from 'screen -ls'"
echo " * Connect to the session with 'screen -r <name or id>'"
echo " * [Option 1] Stop the session by killing the running process with Ctrl + c (and follow any subsequent instructions), then enter Ctrl + d"
echo " * [Option 2] Disconnect from the ssession (but leave it running) with Ctrl + a, Ctrl + d"
echo "Screen session logs started on container launch are written in the /rcv-data/consolel-log-<session_name>.log files as well."
echo ""

# Now start a shell for container persistence
/bin/bash
