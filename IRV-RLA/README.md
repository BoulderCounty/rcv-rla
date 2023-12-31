# IRV Audit Assertion Generator
This folder contains the necessary code to run the IRV audit assertion generator, and to create assertions to test based on contest cast vote records. 
It is based on the work by Michelle Blom in https://github.com/michelleblom/audit-irv-cp, and specifically the raire-branch: https://github.com/michelleblom/audit-irv-cp/tree/raire-branch

## Tool Usage Instructions
* This tool should be run from the commandline of the docker container.
* It expects that there is a volume mount presented at `/rcv-data/` with a `bccr` subfolder
* There should be a RAIRE.txt file in the `/rcv-data/bccr` folderthat contains the RAIRE format CVR for the contest being audited
* The assertions should be generated using the command:
  `irvaudit -rep_ballots /rcv-data/bccr/RAIRE.txt -r 0.05 -agap 0.0 -alglog -simlog -json /rcv-data/bccr/bc-assertions.json`

Excerpts from the original README from that repository follows for reference purposes. View that repository for complete instructions and test examples (with supporting test data).

----------------------------------------------------------------------------

## RAIRE: Risk-limiting Audits for Instant Runoff vote Elections

We have adapted Philip Stark's comparison audits (for first past the 
post elections) to IRV. The code in this repository is designed to be used for
generating audit configurations for multiple IRV elections. 

The output is a list of assertions which, if all true, imply that the 
announced election outcome is correct.  These assertions should then all
be tested using an RLA.  RAIRE guarantees to be sound in the sense that 
_if_ the assertions are all true _then_ the announced election outcome 
must be correct.  It tries to find the assertions that are most likely
to be confirmed with the least auditing (if true).  However, optimality
is not guaranteed: there may be an alternative set of assertions that could
prove the outcome with less work.  This is made more precise in our paper:
https://arxiv.org/abs/1903.08804

RAIRE makes its sample-size estimates using Stark's 'Super-simple simultaneous
single-ballot risk-limiting audits':
https://www.usenix.org/legacy/event/evtwote10/tech/full_papers/Stark.pdf
If you use a different method in which the expected sample is (like
super-simple) inversely proportional to the diluted mean, then the 
assertions will probably still be close to optimal, though the estimates
of sample size may be wrong by a constant factor. 

If you use an auditing method in which the expected sample size is  
inversely proportional to the square of the diluted mean (such as
Lindeman, Stark and Yates `BRAVO: Ballot-polling Risk-limiting Audits to 
Verify Outcomes', you should generate your assertions using the 
BRAVO-based version of RAIRE at
https://github.com/michelleblom/audit-irv-bp

RAIRE asks for a risk limit to be specified, which is used in the 
sample size estimate but makes no difference to which assertions are
chosen.  The assertions it produces can be used in an audit with any
desired risk limit -- the audit will just involve more/fewer ballot 
polls than estimated by the software. 

## How to use this tool for generating an audit configuration (in JSON format).

1. Compile (if using Linux, you can probably use the provided Makefile,
otherwise you will likely need to write a custom Makefile).

2. To generate an audit with a risk limit of 5%, run the command: 

./irvaudit -rep_ballots REPORTED_BALLOT_FILE -r 0.05  
    -agap 0.0 -alglog -simlog -json OUTPUT_AUDIT_SPEC.json

Parameters:

-rep_ballots REPORTED_BALLOT_FILE specifies the input data.  Some
examples are provided in /USIRV  

-r specifies the risk limit.  

The 'alglog' and 'simlog' parameters, if provided,
will simply print the current status of the algorithm as it progresses. They
are not necessary, but useful. 

-json OUTPUT_AUDIT_SPEC.json specifies the output data file, which
describes the assertions in json.

The 'agap' parameter controls the degree of 'suboptimality' you are willing to
accept in your audit configuration. The software is designed to produce a
series of assertions that, with the given parameters (risk limit), requires the
least number of estimated ballot polls to audit.  Depending on the election,
the algorithm may take longer than you would like to find the optimal set of
assertions (it also has to prove that these are optimal). With agap = 0.005, we
are saying that the configuration found can be 0.5% away from optimal, or
require 0.5% more auditing effort than the optimal audit. Increasing it should
make audit generation quicker. The default is 0.005, so you can leave off this
flag if you want to keep it at this value. One good strategy is to start with
agap = 0.0 and see whether you get an answer in a reasonable time.  If so,
keep it.

Optionally, add the flag -contests N C1 C2 C3 ... to the run command to 
select which contests, mentioned in the input data, you want to generate 
audits for.

N refers to the number of contests you want to audit.
C1, C2, ... are the IDs of these contests.

If you do not include the -contests flag, an audit will be generated for
each contest mentioned in the input data. The output log will indicate
which contests an audit was generated for, and if any contests require 
a full recount. For the latter contests, an audit configuration is not
included in the JSON output.
