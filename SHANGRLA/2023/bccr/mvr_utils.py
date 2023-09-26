import os

def split_sample_for_mvr(sample_file_count)
    for i,chunk in enumerate(pd.read_csv(SAMPLE_OUTPUT_FILE_PATH, chunksize=sample_file_count)):
        chunk.to_csv('sample_group_{}_of_{}{}.csv'.format(i+1,BC_MVR_COUNT,DTM_SUFFIX), index=False)
    print(f'Created {BC_MVR_COUNT} sample files named sample_group_<n>_of_{BC_MVR_COUNT}{DTM_SUFFIX}.csv.')

def merge_mvr_file_segments(num_mvr_files, sample_size, mvr_file_name):
    print(f"\nConfirming presence of expected quantity and file names of MVR input files.")

    mvr_file_errors = False

    for x in range(1, num_mvr_files+1):
        if os.path.isfile(f'./mvr_{x}_of_{num_mvr_files}.json'):
            print(f"  - Found expected input file {x} of {num_mvr_files} (mvr_{x}_of_{num_mvr_files}.json)")
        else:
            print(f"  - ERROR - Cannot file MVR json file mvr_{x}_of_{num_mvr_files}.json")
            mvr_file_errors = True

    if mvr_file_errors == True:
        print(f"\n\u2718 An error occurred reading expected input files. See above output, correct the issue, and try again.\n")
        quit(1)

    print(f"\nOriginal sample size is {sample_size}. Final count from merged MVR ballot data should match this count.\n")

    for x in range(1, num_mvr_files+1):
        # Open JSON file
        mvr_input_file = open(f'./mvr_{x}_of_{num_mvr_files}.json')

        # Read JSON into dictionary
        if x == 1:
            print(f"Processing input file: mvr_{x}_of_{num_mvr_files}.json.")
            print(f"Creating primary object to merge data from all MVR files.")   
            mvr_data = json.load(mvr_input_file)
            print(f"  - MVR ballot data from file mvr_{x}_of_{num_mvr_files}.json has {len(mvr_data['ballots'])} elements")
        else:
            print(f"\nProcessing input file: mvr_{x}_of_{num_mvr_files}.json.")
            mvr_curfile_data = json.load(mvr_input_file)
            print(f"  - MVR ballot data from file mvr_{x}_of_{num_mvr_files}.json has {len(mvr_curfile_data['ballots'])} elements")
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

    with open(mvr_file_name, 'w') as mvr_output_file:
        mvr_output_file.write(json.dumps(mvr_data)
