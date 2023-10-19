import os
import json
import pandas as pd

def split_sample_for_mvr(samples_per_file, sample_output_file_path, file_write_path, mvr_stations, dtm_suffix, round_counter):
    print(f'Splitting round {round_counter} sample file into {mvr_stations} files, with {samples_per_file} ballots per file.\nThe last file may contain fewer based on division across stations.')
    for i,chunk in enumerate(pd.read_csv(sample_output_file_path, chunksize=samples_per_file)):
        chunk.to_csv('{}round_{}_sample_group_{}_of_{}{}.csv'.format(file_write_path,round_counter,i+1,mvr_stations,dtm_suffix), index=False)
    print(f'Created {mvr_stations} round {round_counter} sample files named round_{round_counter}_sample_group_<n>_of_{mvr_stations}{dtm_suffix}.csv.')


def merge_mvr_file_segments(num_mvr_files, sample_size, mvr_file_name, file_write_path, round_counter):
    print(f"\nConfirming presence of expected quantity and file names of MVR input files.")

    mvr_file_errors = False

    for x in range(1, num_mvr_files+1):
        if os.path.isfile(f'{file_write_path}round_{round_counter}_mvr_{x}_of_{num_mvr_files}.json'):
            print(f"  - Found expected input file {x} of {num_mvr_files} (round_{round_counter}_mvr_{x}_of_{num_mvr_files}.json)")
        else:
            print(f"  - ERROR - Cannot find file MVR json file round_{round_counter}_mvr_{x}_of_{num_mvr_files}.json")
            mvr_file_errors = True

    if mvr_file_errors == True:
        print(f"\n\u2718 An error occurred reading expected input files. See above output, correct the issue, and try again.\n")
        return(False)

    print(f"\nOriginal sample size is {sample_size}. Final count from merged MVR ballot data should match this count.\n")

    for x in range(1, num_mvr_files+1):
        # Open JSON file
        mvr_input_file = open(f'{file_write_path}round_{round_counter}_mvr_{x}_of_{num_mvr_files}.json')

        # Read JSON into dictionary
        if x == 1:
            print(f"Processing input file: round_{round_counter}_mvr_{x}_of_{num_mvr_files}.json.")
            print(f"Creating primary object to merge data from all MVR files.")   
            mvr_data = json.load(mvr_input_file)
            print(f"  - MVR ballot data from file round_{round_counter}_mvr_{x}_of_{num_mvr_files}.json has {len(mvr_data['ballots'])} elements")
        else:
            print(f"\nProcessing input file: round_{round_counter}_mvr_{x}_of_{num_mvr_files}.json.")
            mvr_curfile_data = json.load(mvr_input_file)
            print(f"  - MVR ballot data from file round_{round_counter}_mvr_{x}_of_{num_mvr_files}.json has {len(mvr_curfile_data['ballots'])} elements")
            print(f"  - Merging input file {x} ballot data ({len(mvr_curfile_data['ballots'])} elements) into primary MVR data.")
            mvr_data['ballots'].extend(mvr_curfile_data['ballots'])
            print(f"  - Primary MVR data now contains {len(mvr_data['ballots'])} elements.")   

        # Close input file
        mvr_input_file.close()

    print(f"\nAll MVR input files processed.\n")   

    if len(mvr_data['ballots']) == sample_size:
        print(f"\u2714 SUCCESS - Merged MVR data contains {len(mvr_data['ballots'])} ballots, which is the expected count.\n ")
    else:
        print(f"\u2718 FAILURE - Merged MVR data contains {len(mvr_data['ballots'])}, but the expected count was {sample_size}.\n")

    if os.path.isfile(mvr_file_name):
        print(f'*** WARNING ***\nThe merged output MVR file {mvr_file_name} already exists.')
        print(f'Please remove and re-run this step.')
        return(False)
    else:
        with open(mvr_file_name, 'w') as mvr_output_file:
            mvr_output_file.write(json.dumps(mvr_data))
        return(True)



def create_mvr_contest_json(contest, mvr_contest_json_file_name):
    mvr_contest = {"contests": [{}],"candidates":[]}

    mvr_con_id = next(iter(contest))
    mvr_con_desc = contest[mvr_con_id]['name']

    mvr_contest["contests"][0]["description"] = mvr_con_desc
    mvr_contest["contests"][0]["id"] = int(mvr_con_id)

    for cand_id,cand_desc in contest[mvr_con_id]["candidate_info"].items():
        new_candidate = {}
        new_candidate["description"] = cand_desc
        new_candidate["id"] = int(cand_id)
        new_candidate["type"] = "Regular"
        mvr_contest["candidates"].append(new_candidate)

    with open(mvr_contest_json_file_name, 'w') as mvr_contest_json_file:
        mvr_contest_json_file.write(json.dumps(mvr_contest))

    if os.path.isfile(f'{mvr_contest_json_file_name}'):
        return(f"SUCCESS - Created MVR contest json file: {mvr_contest_json_file_name}.", mvr_contest)
    else:
        return(f"ERROR - Unable to create or find MVR contest json file: {mvr_contest_json_file_name}.", {"ERROR"})
