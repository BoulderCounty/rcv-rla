# Boulder County RCV RLA Process
**IMPORTANT DRAFT NOTICE**<br>
All content presented in this page and GitHub repository should be considered draft.<br>
This content has not been reviewed or approved by authorized individuals at Boulder County.</p>

___

## Table of Contents
1. [Background, Theory, Contributors, and Approach Justification](#id-section1)
2. [SHANGRLA Overview](#id-section2)
3. [Risk Limiting Audit Process Overview](#id-section3)
4. [Tool and Repository Overview](#id-section4)
5. [Detailed Process for Performing a Risk Limiting Audit](#id-section5)<br>
    5.1. [Prerequisites](#id-section5.1)<br>
    5.2. [Activating the RLA Environment](#id-section5.2)<br>
    5.3. [Create the RAIRE formatted CVR file](#id-section5.3)<br>
    5.4. [Generate the Assertions to Test](#id-section5.4)<br>
    5.5. [Generate the Manifest Card Count](#id-section5.5)<br>
    5.6. [Generate the RLA Ballot Sample](#id-section5.6)<br>
    5.7. [Generate a Contest File for the MVR Tool](#id-section5.7)<br>
    5.8. [Run the Manual Vote Recorder Tool for Sample Comparison](#id-section5.8)<br>
    5.9. [Complete the Audit](#id-section5.9)<br>
    5.10. [Stop Container and Backup the Data Generated from the RLA](#id-section5.10)
6. [General Security Notes and Considerations](#id-section6)

<div id='id-section1'/>


## 1. Background, Theory, Contributors, and Approach Justification
The Boulder County 2023 Ranked Choice Voting (RCV) Risk Limiting Audit (RLA) process is based on published work and code from leading researchers in the field of statistics and elections auditing:

* **Philip B. Stark**
  * Distinguished Professor of Statistics, University of California, Berkley
  * **About**: https://statistics.berkeley.edu/people/philip-b-stark
  * **Other Information**: https://www.stat.berkeley.edu/~stark/Vote/index.htm
* **Dr. Michelle Blom**
  * Senior Research Fellow, AI and Autonomy Lab of the School of Computing and Information Systems at the University of Melbourne, Australia
  * RAIRE Technical Specialist, Democracy Developers (https://www.democracydevelopers.org.au)
  * **About**: https://michelleblom.github.io/
  * **Other Information**: https://findanexpert.unimelb.edu.au/profile/178724-michelle-blom
* **Dr. Vanessa Teague**
  * Adjunct Associate Professor, The Australian National University, Canberra, Australia
  * Chairperson / Founder, Democracy Developers (https://www.democracydevelopers.org.au)
  * **About**: https://researchers.anu.edu.au/researchers/teague-v

The majority of the work product used to build this toolset is based on the efforts of the aforementioned individuals. See also the following paper detailing the process used for the 2019 San Francisco District Attorney Instant Runoff Vote: https://arxiv.org/pdf/2004.00235.pdf

The County has received input and feedback from Dr. Blom and Dr. Teague during the County technology review and testing process. As a Colorado leader in using instant runoff voting (i.e. ranked choice voting), Boulder County needs a viable process to perform a risk limiting audit in advance of broad RCV RLA tool availability in future elections, expected to be provided by the State. 

Notably, the Colorado Secretary of State cites resources from Philip B. Stark's work on the Secretary of State’s Risk-Limiting Audit Resources page: https://www.sos.state.co.us/pubs/elections/VotingSystems/riskAuditResources.html. Additional resources provided by the Secretary of State, including Frequently Asked Questions (FAQs) can be be found here: https://www.sos.state.co.us/pubs/elections/RLA/faqs.html. 

[Rule4](https://rule4.com) is a cybersecurity and infrastructure consulting company based in Boulder, CO whose team members have partnered with the Boulder County Clerk & Recorder's Office for over 15 years on various initiatives related cybersecurity and the safe application of technology. Rule4 has provided support at the request of the Clerk & Recorder's office to operationalize the code necessary to use this collection of risk limiting audit tools. Rule4 maintains the repository for this Boulder County RCV RLA process. Rule4's effort focused on aggregating those discrete tools into a manageable process, reducing the potential for human error when possible, and enabling the County to achieve relative independence when performing the RLA for RCV contests.

In summary, Boulder County has performed reasonable due diligence in ensuring that resources, both individuals and code, used to establish an interim process for performing risk limiting audits for ranked choice voting are of high integrity, and consistent with the spirit and intent of risk-limiting audit objectives. 

<div id='id-section2'/>

### 2. SHANGRLA Overview
The process summary from the [SHANGRLA reference implementation used in 2019 for San Francisco](https://github.com/pbstark/SHANGRLA/edit/primaries/README.md) is included here to provide context on terminology and the approach (with minor modifications based on URL accessibility and formatting).

>Sets of Half-Average Nulls Generate Risk-Limiting Audits (SHANGRLA)
by Michelle Blom, Andrew Conway, Philip B. Stark, Peter J. Stuckey and Vanessa Teague. 
>
>Risk-limiting audits (RLAs) offer a statistical guarantee: if a full manual tally of the paper ballots would show that the reported election outcome is wrong, an RLA has a known minimum chance of leading to a full manual tally. RLAs generally rely on random samples.
>
>With SHANGRLA we introduce a very general method of auditing a variety of election types, by expressing an apparent election outcome as a series of assertions.  Each assertion is of the form "the mean of a list of non-negative numbers is greater than 1/2." The lists of nonnegative numbers correspond to assorters, which assign a number to the selections made on each ballot (and to the cast vote record, for comparison audits).
>
>Each assertion is tested using a sequential test of the null hypothesis that its complement holds. If all the null hypotheses are rejected, the election outcome is confirmed. If not, we proceed to a full manual recount.
>
>SHANGRLA incorporates several different statistical risk-measurement algorithms and extends naturally to plurality and super-majority 
contests with various election types including Range and Approval voting and Borda count.  
>
>It can even incorporate Instant Runoff Voting (IRV) using the RAIRE assertion-generator (https://github.com/michelleblom/audit-irv-cp). This produces a set of assertions sufficient to prove that the announced winner truly won.  Observed paper ballots can be entered using Dan King and Laurent Sandrolini's tool for the San Francisco Election board (https://github.com/dan-king/RLA-MVR).
>
>We provide an open-source reference implementation and exemplar calculations in Jupyter notebooks.

<div id='id-section3'/>

## 3. Risk Limiting Audit Process Overview
The general process for the risk limiting audit is as follows, and assumes that contest, candidate, CVR, and supporting manifest information is available.

1. The CVR and supporting manifests are exported from the Dominion Voting System. 
2. Exported files are transferred to an isolated workstation running the Boulder County RCV-RLA docker container, in a designated local folder that is mounted within the container when it is running.
3. The CVR to RAIRE tool is used to convert a contest from CVR format to RAIRE format, and generate the JSON representing the specific contest of interest to be used by the Jupyter Notebook.
4. The RAIRE format CVR from the contest being audited is processed using the IRV Audit tool to create the assertions JSON file.
5. The Jupyter Notebook is used to process the input data, compute the sample size, and generate a sample from the CVR and an independently generated ballot manifest (generated independently of the Dominion system).
6. The ballots identified in the sample are pulled (physical ballots).
7. The MVR tool is used to record the perceived ballot impressions from manual review.
8. The MVR tool generates a JSON file used for comparison with the dominion CVR data.
9. The measured risk based on generated assertions and the CVR and MVR data is used in conjunction with defined error and risk limit rates to determine if the RLA is deemed satisfied, or if recounts or expanded sampling are required.


<div id='id-section4'/>

## 4. Tool and Repository Overview
The following tools are used to perform the Boulder County RCV RLA process. They are aggregated into a single repository for ease of change control and management, and incorporate customizations to the operation of the tools, but not the underlying statistical methods or procedures. Each link is to the folder containing the respective tool in the main branch of the repository used by the County. The Readme at each folder level provides links to the source repositories from which this code was acquired.
1. [IRV Audit Assertion Generator](https://github.com/Rule4Inc/BoCo-RCV-RLA/tree/main/IRV-RLA)
2. [Manual Vote Recorder](https://github.com/Rule4Inc/BoCo-RCV-RLA/tree/main/MVR)
3. [SHANGRLA Notebook](https://github.com/Rule4Inc/BoCo-RCV-RLA/tree/main/SHANGRLA)


<div id='id-section5'/>

## 5. Detailed Process for Performing a Risk Limiting Audit

<div id='id-section5.1'/>

### 5.1. Prerequisites
- [ ] This process requires that you have access to a service enabling you to run containers. Docker Desktop is suggested and is available here: https://www.docker.com/products/docker-desktop/
- [ ] You should be comfortable running basic commands from a command line (following instructions)
- [ ] You will need to designate a local folder to present data to the container. For example, create a folder under C:\ called rcv-data, and create a subfolder under c:\rcv-data called bccr. The subfolder is not required, but useful for containing data ready for processing (whereas the root rcv-data folder may be used to handle temporary data, or not used at all.)
- [ ] You will need access to the following files. Place them in the `c:\rcv-data\bccr` folder on your local system.
  * Dominion Files (these are generated by the Dominion Voting System):
    * CountingGroupManifest.json
    * ContestManifest.json
    * CandidateManifest.json
    * CvrExport.json
  * Non-Dominion Files
    * A ballot manifest associated with the contest, also placed in the `c:\rcv-data\bccr` folder on your local system. This file should be in Excel (xlsx) format, ideally named `manifest.xlsx` and contain only the following columns (with case and spellings exactly as indicated):
      * **Tray**: Can be populated with 1 for each row, given the use of single-tray tabulators.
      * **Tabulator Number**: The scanning station. Must match the format used in the CVR (i.e. three-digit numeric identifiers)
      * **Batch Number**: The batch number
      * **Total Ballots**: Ballots in the associated batch number
      * **VBMCart.Cart number**: Storage location identifier
    * The manifest file should resemble the following when viewed:
        | Tray | Tabulator Number | Batch Number | Total Ballots | VBMCart.Cart number |
        | ---- | ---------------- | ------------ | ------------- | ------------------- |
        | 1 |103 | 1 | 150 | 3 |
        | 1 |103 | 2 | 146 | 3 |
        | 1 |105 | 4 | 150 | 2 |
        | ... |... |... | ... | ... |

<div id='id-section5.2'/>

### 5.2. Activating the RLA Environment
- [ ] 5.2.1. From a command line (e.g. `cmd.exe`), pull the current Docker container. Unless there are known changes to the container, this only has to be performed once. This command pulls the container image that is tagged `latest` (i.e. the most recently updated image in the repository):
    ```
    docker pull us-west3-docker.pkg.dev/rule4-container-registry/boco-rcv-rla/rcv-rla:latest
    ```
- [ ] 5.2.2. Start the container (adjusting the local path `/c/rcv-data` if necessary based on where the local folder was created):
    ```
    docker run -itd --name bc-rla -p 127.0.0.1:8888:8888 -p 127.0.0.1:8887:8887 -v /c/rcv-data:/rcv-data/ us-west3-docker.pkg.dev/rule4-container-registry/boco-rcv-rla/rcv-rla
    ```

    Command Explanation:
    * `docker run -itd` : _Run the docker container and allocate a pseudo-TTY connected to the container’s stdin; creating an interactive bash shell in the container, and support backgrounding as a daemon_
    * `--name bc-rla**  _Set the name for the container to run as_
    * `-p 127.0.0.1:8888:8888` : _Accept connections only on the Docker host's local interface on port 8888, and map to port 8888 in the container (used for the Jupyter Notebook)_
    * `-p 127.0.0.1:8887:8887` : _Accept connections only on the Docker host's local interface on port 8887, and map to port 8887 in the container (used for the MVR Tool node.js application and CVR-to-RAIRE conversion tool)_
    * `-v /c/rcv-data:/rcv-data/` : _Mount the local folder /c/rcv-data (c:\rcv-data) to /rcv-data in the container_._
    * `us-west3-docker.pkg.dev/rule4-container-registry/boco-rcv-rla/rcv-rla` : _The container image to run (pulled in the previous step)_
- [ ] 5.2.3. Connect to the terminal/shell to in preparation for using the irvaudit tool to create the assertions to test. If you named your container something other than bc-rla, change the name as appropriate in the following command:

    ```
    docker exec -it bc-rla /bin/bash
    ```
- [ ] 5.2.4. Refresh local copies of code in the container from the main repository in the event the notebook or other files have been updated. Only do this once when starting the RLA process, otherwise your notebook (and an work underway) may be overwritten.
    ```
    cd /opt/BoCo-RCV-RLA
    git pull
    ```

<div id='id-section5.3'/>

### 5.3. Create the RAIRE formatted CVR file
- [ ] 5.3.1. Navigate to http://localhost:8887/html/ConvertCVRToRAIREwithJSON.html in a web browser
- [ ] 5.3.2. Load the four .json files from the Dominion Voting System that you placed in `c:\rcv-data\bccr`
- [ ] 5.3.3. Review the `Then choose options on how to deal with some issues` and `Next, choose the ballot types you want to audit` parameters and adjust if appropriate
- [ ] 5.3.4. Select the contest being audited by checking the appropriate checkbox
- [ ] 5.3.5. Copy the JSON text between the --------------- boundaries for the contest you are auditing. Place this in an empty notepad text file, or leave this browser tab open. You will insert this data into the notebook in a later step. Don't worry - if you lose this, you'll be able to regenerate it using steps 5.3.1-5.3.4 above.
- [ ] 5.3.6. Scroll to the bottom of the page, and click the `Download RAIRE format` link. Make a note of where this file is saved and move the file to `c:\rcv-data\bccr` -OR- choose to save it in `c:\rcv-data\bccr` if prompted. Name the file (or rename it if it automatically saves with an alternate name) as `RAIRE.txt`

<div id='id-section5.4'/>

### 5.4. Generate the Assertions to Test
- [ ] 5.4.1. Navigate to the shell you opened in step 5.2.3
- [ ] 5.4.2. Change to the bccr directory in the container shell, and run the irvaudit assertion generator to create the assertion file:
    ```
    cd /rcv-data/bccr
    irvaudit -rep_ballots RAIRE.txt -r 0.05 -agap 0.0 -alglog -simlog -json bc-assertions.json
    ```
- [ ] 5.4.3. Leave this shell open, you will use it later in the process to backup contest data.

<div id='id-section5.5'/>

### 5.5. Generate the Manifest Card Count
- [ ] 5.5.1. Open the manifest.xlsx file that you should have placed in c:\rcv-data\bccr
- [ ] 5.5.2. Auto-sum all the populated cells in the fourth column, `Total Ballots`, excluding the header
- [ ] 5.5.3. Make a note of this value - it will be used in the following step

<div id='id-section5.6'/>

### 5.6. Generate the RLA Ballot Sample
- [ ] 5.6.1. Launch the Jupyter Notebook by visiting http://localhost:8888 in a web browser
- [ ] 5.6.2. Open the BC-RLA.ipynb file by double clicking it in the left sidebar The notebook is broken into cells, and each cell has a []: indicator to the left. 
- [ ] 5.6.3. Scroll to the second cell following the header titled `Boulder County RLS Setup Task #1: Populate required parameters`. Adjust the following parameters:
    * SEED: This should be provided by the State
    * MANIFEST_CARDS: Enter the value computed in Step 5.5
- [ ] 5.6.4. Review the other parameters in cell 2 of the notebook, and adjust if appropriate (depending on your file and folder naming preferences if the defaults were not used)
- [ ] 5.6.5. Navigate to cell 3 under the header `Boulder County RLA Setup Task #2: Paste contest JSON from CVR to RAIRE conversation tool`
- [ ] 5.6.6. Copy the JSON contest data you acquired and stored in notepad in step 5.3.5 above (or revisit the ConvertCVRToRAIREwithJSON page to acquire it)
- [ ] 5.6.7. Paste this JSON contest data and overwrite the block `{ 'PASTE OVER THIS BLOCK' }` (including pasting over the curly braces)
- [ ] 5.6.8. Navigate to the notebook section titled `Read the audited sample data` and click that cell
- [ ] 5.6.9. Select the `Kernel` menu from the Notebook frame in the browser, and select the `Restart Kernel and Run up to Selected Cell...` option
- [ ] 5.6.10. Monitor notebook execution. As each cell completes, the box to the left, [ ]: will populate with a number indicating the cell, e.g. [7]: to denote completion. 
- [ ] 5.6.11. Monitor execution until the cell beginning `# write the sample` completes under the "Draw the first sample" section of the notebook.
- [ ] 5.6.12. If there are no errors, open the `c:\rcv-data\bccr` folder on your workstation. You should now have a file named `sample_<date_time_in_UTC>.csv`. Verify the presence of this file. If there are errors, you'll need to review them, address them, and then restart from step 5.6.9.
- [ ] 5.6.13. Create a copy of this CSV file for later reference purposes if needed. It is suggested you navigate to the `c:\rcv-data\bccr` folder and copy the `sample_<date_time_in_UTC>.csv` file to a file named `sample_<date_time_in_UTC>.csv.backup`.
- [ ] 5.6.14. In step 17 under "Find initial sample size", there should be a sample_size=<n> value. Make a note of whatever the value for n is. We will use this as a check in the MVR tool.
- [ ] 5.6.15. Save the workbook and progress using the save button, and leave the window/tab for this notebook open. You will come back to this after completing the MVR process.

<div id='id-section5.7'/>

### 5.7. Generate a Contest File for the MVR Tool
- [ ] 5.7.1. Navigate to http://localhost:8887/load-contest in a web browser
- [ ] 5.7.1. Open Notepad on your workstation, and copy the JSON starter content from the contest.json frame in the MVR tool into Notepad
- [ ] 5.7.3. Edit the contest and candidates sections, including at least the fields indicated in the example contest.json content (updating all with your current contest information)
- [ ] 5.7.4. Save the file as `contest.json` in `c:\rcv-data\bccr`

<div id='id-section5.8'/>

### 5.8. Run the Manual Vote Recorder Tool for Sample Comparison
- [ ] 5.8.1. This process requires that two reviewers participate; one to mark the ballot representations, and one to review and confirm the marks are representative of what is on the ballot. Gather the two reviewers before continuing this process.
- [ ] 5.8.2. Navigate to http://localhost:8887/load-contest in a web browser if you are not already there from step 5.7.
- [ ] 5.8.3. Click the `Choose File` button under `Contest (JSON)`, and select the file you created in step 5.7.4.
- [ ] 5.8.4. Click the `Choose File` button under `Ballots (CSV)`, and select the file that was created in step 5.6.11.
- [ ] 5.8.5. Click the `Upload Contest Details` button.
- [ ] 5.8.6. Review the confirmation page, and recognize that if you create a new contest in the tool it will end any contest already being tested. I.e. _this tool is intended to process one contest at a time!_
- [ ] 5.8.7. Click the `Create Contest` button.
- [ ] 5.8.8. Verify you receive a "Success loading and creating contest!" message, and then click the `Mark Ballot` button.
- [ ] 5.8.9. Locate the drop-down to the right in the green frame, prefixed by "Select Imprinted ID from remaining list of n". Compare this n value to the one recorded in 5.6.14. These should match. If not, further analysis will be required to determine why there is a discrepancy. Note that this value will start at the size of n, and decrease by one for each ballot that is marked in the tool.
- [ ] 5.8.10. [**Reviewer 1**] Select and imprinted ID from the drop-down, and request/retrieve the corresponding ballot.
- [ ] 5.8.11. [**Reviewer 1**] Mark the ballot representation in the MVR tool based on your interpretation of the physical ballot, then click the "Submit for Verification" button.
- [ ] 5.8.12. [**Reviewer 2**] Review and verify the selections presented based on Reviewer 1 input. 
    * If there is consensus in marking, click the "Confirmed" button.
    * If there is disagreement, Reviewer 2 (in discussion with Reviewing 1) may elect to click the "Revise Selections" button. If consensus can be reached, the ballot should be re-marked, and submitted. See the next bullet if consensus cannot be reached.
    * If consensus cannot be achieved, click the "No Consensus" button.  Assuming this button was clicked intentionally, click the "Confirmed. No Consensus. Submit blank ballot." button.
- [ ] 5.8.13. Reviewer 1 or 2 may click the "Continue" button after reviewing the comparison of the literal and processed ballots. This will return the tool to the Mark Ballot Imprinted ID selection page.
- [ ] 5.8.14. Repeat steps 5.8.10 thru 5.8.13 until all ballots have been marked. After final ballot submission, you should see a screen that reads "Thank you. All ballots have been marked."
- [ ] 5.8.15. Click the Export Contest link, or browse to http://localhost:8887/export-contest
- [ ] 5.8.16. Use the buttons near the bottom of the page to download the `mvr_output.json` and `mvr_ballots.csv` files. Save these (or move them after saving) to `c:\rcv-data\bccr`. You'll now complete the workbook and audit process.

<div id='id-section5.9'/>

### 5.9. Complete the Audit
- [ ] 5.9.1. Return to the Jupyter Notebook tab/window in your browser (from step 5.6.15), and navigate to the cell following the header "Read the audited sample data". This directly follows the cell that wrote the sample CSV file in notebook cell #22. The comment in the cell reads "# Read MVR data".
- [ ] 5.9.2. Click the play button near the top of the notebook. Use this play button to progress through each successive cell (one cell at a time), up to an including the "Log the status of the audit" cell. 
- [ ] 5.9.3. Review the audit results in cell 27. Specifically, review the contest audit status.
  * Audit COMPLETE will indicate the audit completed, and the results as scored were confirmed to be within the risk limit for the audit.
  * Audit INCOMPLETE indicates that the audit has found issues beyond the risk limit.
- [ ] 5.9.4. Press the save button in the notebook to save the current state and output in the notebook, including the results.

<div id='id-section5.10'/>

### 5.10. Stop Container and Backup the Data Generated from the RLA
- [ ] 5.10.1 Return to the console you opened in section 5.2. If that was closed, from a command prompt (`cmd.exe`) run the following command to connect to the container:
    ```
    docker exec -it bc-rla /bin/bash
    ```
- [ ] 5.10.2 Run the following command sequence from the container shell. You should replace \<contest\> and \<yyyy-mm-dd\> placeholders incusive of the angle brackets with relevant values in each case command:
    ```
    cp /opt/BoCo-RCV-RLA/SHANGRLA/2023/BC-RLA.ipynb /rcv-data/bccr/BC-RLA_<contest>_<yyyy-mm-dd>.ipynb
    cd /rcv-data
    tar -cvf bc-rla_<contest>_<yyyy-mm-dd>.tar bccr
    ```
- [ ] 5.10.4 Stop the docker container from a command prompt (opening a new one if necessary via `cmd.exe`):
    ```
    docker stop bc-rla
    ```
- [ ] 5.10.4 On your primary workstation (not the container shell),  navigate to `c:\rcv-data`. 
- [ ] 5.10.5 Rename the `bccr` folder to `bccr_<contest>_<yyyy-mm-dd>`, and then create a new empty `bccr` folder for the next RLA.
- [ ] 5.10.6 Copy the backup file named `bc-rla_<contest>_<yyyy-mm-dd>.tar` to the approved RLA storage location.


<div id='id-section6'/>
<br><br>

___

## 6. General Security Notes and Considerations
* While access to the containerized resources is via http as opposed to https, it is important to note that access is restricted only to the local system (i.e. only the local system can connect to exposed ports in the container). There is no network transmission of data to perform this process.
* The MVR tool is an alpha version developed several years ago by Dan King. There are currently multiple vulnerable components used to support this node.js application. However, given the container access restrictions and the intentional lack of network access to this container, the risk of using known vulnerable components in the container was deemed acceptable. 