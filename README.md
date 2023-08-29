# Boulder County RCV RLA Process

## Table of Contents
1. [Background, Theory, and Approach Justification](#id-section1)
2. [Risk Limiting Audit Process Overview](#id-section3)
3. [Tool and Repository Overview](#id-section3)
4. [Process for Performing a Risk Limiting Audit](#id-section4)

<div id='id-section1'/>

## Background, Theory, and Approach Justification
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
The general process for the risk limiting audit is as follows, and assumes that contest, candidate, CVR, and supporting manifest information is now available.

1. The CVR and supporting manifests are exported from the Dominion Voting System. Required files include:
    * CountingGroupManifest.json
    * ContestManifest.json
    * CandidateManifest.json
    * CvrExport.json
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
{TBD}
