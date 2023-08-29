# Boulder County RCV RLA Process
***<p style="text-align: center;">IMPORTANT DRAFT NOTICE </p>***
<p style="text-align: center;"> All content presented in this page and GitHub repository should be considered draft.<br> This content has not been reviewed or approved by authorized individuals at Boulder County.</p>

___

## Table of Contents
1. [Background, Theory, Contributors, and Approach Justification](#id-section1)
2. [Risk Limiting Audit Process Overview](#id-section3)
3. [Tool and Repository Overview](#id-section3)
4. [Detailed Process for Performing a Risk Limiting Audit](#id-section4)

<div id='id-section1'/>


## Background, Theory, Contributors, and Approach Justification
The Boulder County 2023 Ranked Choice Voting (RCV) Risk Limiting Audit (RLA) process is based on published work and code from leading researchers in the field of statistics and elections auditing:

* Philip B. Stark
  * Distinguished Professor of Statistics, University of California, Berkley
  * **About**: https://statistics.berkeley.edu/people/philip-b-stark
  * **Other Information**: https://www.stat.berkeley.edu/~stark/Vote/index.htm
* Dr. Michelle Blom
  * Senior Research Fellow, AI and Autonomy Lab of the School of Computing and Information Systems at the University of Melbourne, Australia
  * RAIRE Technical Specialist, Democracy Developers (https://www.democracydevelopers.org.au)
  * **About**: https://michelleblom.github.io/
  * **Other Information**: https://findanexpert.unimelb.edu.au/profile/178724-michelle-blom
* Dr. Vanessa Teague
  * Adjunct Associate Professor, The Australian National University, Canberra, Australia
  * Chairperson / Founder, Democracy Developers (https://www.democracydevelopers.org.au)
  * **About**: https://researchers.anu.edu.au/researchers/teague-v

The majority of the work product used to build this toolset is based on the efforts of the aforementioned individuals. See also the following paper detailing the process used for the 2019 San Francisco District Attorney Instant Runoff Vote: https://arxiv.org/pdf/2004.00235.pdf

The County has received input and feedback from Dr. Blom and Dr. Teague during the County technology review and testing process. As a Colorado leader in using instant runoff voting (i.e. ranked choice voting), Boulder County needs a viable process to perform a risk limiting audit in advance of broad RCV RLA tool availability in future elections, expected to be provided by the State. 

Notably, the Colorado Secretary of State cites resources from Philip B. Stark's work on the Secretary of State’s Risk-Limiting Audit Resources page: https://www.sos.state.co.us/pubs/elections/VotingSystems/riskAuditResources.html. Additional resources provided by the Secretary of State, including Frequently Asked Questions (FAQs) can be be found here: https://www.sos.state.co.us/pubs/elections/RLA/faqs.html. 

[Rule4](https://rule4.com) is a cybersecurity and infrastructure consulting company based in Boulder, CO whose team members have partnered with the Boulder County Clerk & Recorder's Office for over 15 years on various initiatives related cybersecurity and the safe application of technology. Rule4 has provided support at the request of the Clerk & Recorder's office to operationalize the code necessary to use this collection of risk limiting audit tools. Rule4 maintains the repository for this Boulder County RCV RLA process. Rule4's effort focused on aggregating those discrete tools into a manageable process, reducing the potential for human error when possible, and enabling the County to achieve relative independence when performing the RLA for RCV contests.

In summary, Boulder County has performed reasonable due diligence in ensuring that resources, both individuals and code, used to establish an interim process for performing risk limiting audits for ranked choice voting are of high integrity, and consistent with the spirit and intent of risk-limiting audit objectives. 


### SHANGRLA Overview
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

<div id='id-section2'/>

## Risk Limiting Audit Process Overview
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


<div id='id-section3'/>

## Tool and Repository Overview
The following tools are used to perform the Boulder County RCV RLA process. They are aggregated into a single repository for ease of change control and management, and incorporate customizations to the operation of the tools, but not the underlying statistical methods or procedures. Each link is to the folder containing the respective tool in the main branch of the repository used by the County. The Readme at each folder level provides links to the source repositories from which this code was acquired.
1. [IRV Audit Assertion Generator](https://github.com/Rule4Inc/BoCo-RCV-RLA/tree/main/IRV-RLA)
2. [Manual Vote Recorder](https://github.com/Rule4Inc/BoCo-RCV-RLA/tree/main/MVR)
3. [SHANGRLA Notebook](https://github.com/Rule4Inc/BoCo-RCV-RLA/tree/main/SHANGRLA)


<div id='id-section4'/>

## Detailed Process for Performing a Risk Limiting Audit
### 1. Prerequisites
* This process requires that you have access to a service enabling you to run containers. Docker Desktop is suggested and is available here: https://www.docker.com/products/docker-desktop/
* You should be comfortable running basic commands from a command line (following instructions)
* You will need to designate a local folder to present data to the container. For example, create a folder under C:\ called rcv-data, and create a subfolder under c:\rcv-data called bccr. The subfolder is not required, but usefule for containing data ready for processing (whereas the rootl rcv-data folder may be used to handle temporary data, or not used at all.)
* You will need access to the following files. Place them in the `c:\rcv-data\bccr` folder on your local system.
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


### 2. Activating the RLA Environment
1. From a command line (e.g. `cmd.exe`), pull the current Docker container. Unless there are known changes to the container, this only has to be performed once. This command pulls the container image that is tagged "latest" (i.e. the most recently updated image in the repository):

    ```
    docker pull us-west3-docker.pkg.dev/rule4-container-registry/boco-rcv-rla/rcv-rla:latest
    ```
2. Start the container (adjusting the local path `/c/rcv-data` if necessary based on where the local folder was created):
    
    ```
    docker run -itd --name bc-rla -p 127.0.0.1:8888:8888 -p 127.0.0.1:8887:8887 -v /c/rcv-data:/rcv-data/ us-west3-docker.pkg.dev/rule4-container-registry/boco-rcv-rla/rcv-rla
    ```

    Command Explanation:
    * `docker run -itd` : _Run the docker container and allocate a pseudo-TTY connected to the container’s stdin; creating an interactive bash shell in the container, and support backgrounding as a daemon_
    * `--name bc-rla**  _Set the name for the container to run as_
    * `-p 127.0.0.1:8888:8888` : _Accept connections only on the Docker host's local interface on port 8888, and map to port 8888 in the container (used for the Jupyter Notebook)_
    * `-p 127.0.0.1:8887:8887` : _ccept connections only on the Docker host's local interface on port 8887, and map to port 8887 in the container (used for the MVR Tool node.js application and CVR-to-RAIRE conversion tool)_
    * `-v /c/rcv-data:/rcv-data/` : _Mount the local folder /c/rcv-data (c:\rcv-data) to /rcv-data in the container_._
    * `us-west3-docker.pkg.dev/rule4-container-registry/boco-rcv-rla/rcv-rla` : _The container image to run (pulled in the previous step)_
3. Connect to the terminal/shell to in preparation for using the irvaudit tool to create the assertions to test. If you named your conatiner something other than bc-rla, change the name as appropriate in the following command:

    ```
    docker exec -it bc-rla /bin/bash
    ```
4. Refresh local copies of code in the container from the main repository in the event the notebook or other files have been updated. Only do this once when starting the RLA process, otherwise your notebook (and an work underway) may be overwritten.
    ```
    cd /opt/BoCo-RCV-RLA
    git pull
    ```

### 3. Create the RAIRE formatted CVR file
 1. Navigate to http://localhost:8887/html/ConvertCVRToRAIREwithJSON.html
 2. Load the four .json files from the Dominion Voting System that you placed in `c:\rcv-data\bccr`
 3. Review the "_Then choose options on how to deal with some issues_" and "_Next, choose the ballot types you want to audit._" parameters and adjust if appropriate
 4. Select the contest being audited by checking the appropriate checkbox
 5. Copy the JSON text between the --------------- boundaries for the contest you are auditing. Place this in an empty notepad text file, or leave this browser tab open. You will insert this data into the notebook in a later step. Don't worry - if you lose this, you'll be able to regenerate it using steps 1-4 above.
 6. Scroll to the bottom of the page, and click the `Download RAIRE format` link. Make a note of where this file is saved and move the file to `c:\rcv-data\bccr` -OR- choose to save it in `c:\rcv-data\bccr` if prompted. Name the file (or rename it if it automatically saves with an alternate name) as `RAIRE.txt`
 
### 4. Generate the Assertions to Test
 1. Navigate to the shell you opened in _Detailed Process for Performing a Risk Limiting Audit > 2. Activating the RLA Environment > Step 3_
 2. Change to the bccr directory in the container shell, and run the irvaudit assertion generator to create the assertion file:
    ```
    cd /rcv-data/bccr
    irvaudit -rep_ballots RAIRE.txt -r 0.05 -agap 0.0 -alglog -simlog -json bc-assertions.json
    ```

### 5. Generate the Manifest Card Count
1. Open the manifest.xlsx file that you should have placed in c:\rcv-data\bccr
2. Auto-sum all the populated cells in the fourth column, `Total Ballots`, excluding the header
3. Make a note of this value - it will be used in the following step

### 6. Generate the RLA Ballot Sample
1. Launch the Jupyter Notebook by visiting http://localhost:8888
2. Open the BC-RLA.ipynb file by double clicking it in the left sidebar The notebook is broken into cells, and each cell has a []: indicator to the left. 
3. Scroll to the second cell following the header titled "`Boulder County RLS Setup Task #1: Populate required parameters`". Adjust the following parameters:
  * SEED: This should be provided by the State
  * MANIFEST_CARDS: Enter the value computed in Step 5
4. Review the other parameters in cell 2 of the notebook, and adjust if appropriate (depending on your naming preferences if the defaults were not used)
5. Navigate to cell 3 under the header "`Boulder County RLA Setup Task #2: Paste contest JSON from CVR to RAIRE conversation tool`"
6. Copy the JSON contest data you acquired and stored in notepad in step 3.5 above (or revisit the ConvertCVRToRAIREwithJSON page to acquire it)
7. Paste this JSON contest data and overwrite the block `{ 'PASTE OVER THIS BLOCK' }` (including pasting over the curly braces)
8. Navigate to the notebook section titled "`Read the audited sample data`" and click that cell
9. Select the `Kernel` menu from the Notebook frame in the browser, and select the "`Restart Kernel and Run up to Selected Cell...`" option


## General Security Notes and Considerations
1. While access to the containerized resources is via http as opposed to https, it is important to note that access is restricted only to the local system (i.e. only the local system can connect to exposed ports in the container). There is no network transmission of data to perform this process.
2. The MVR tool is an alpha version developed several years ago by Dan King. There are currently multiple vulnerable components used to support this node.js application. However, given the container access restrictions and the intentional lack of network access to this container, the risk of using known vulnerable components in the container was deemed acceptable. 