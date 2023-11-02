# This is a standalone utility script to create a larger data set for testing.
# It expects a file 'CvrExport.json' in the directory in which the script runs.
# It writes a file 'AugmentedCvrExport.json' with the augmented synthetic data.
import json

ballotsNeeded = 70000 # How many additional ballots do we want to add to the CVR Export?
batchSizeLimit = 70000 # Max batch size


# Counters for loop control
ctrBatchID = 1 # Don't change - should start at 0
ctrRecordID = 0 # Don't change - should start at 0
strBallot = 1 # A/B tracker for creating a close contest
intTabulatorID = 120

class BallotA:
    def __init__(self, batchID, recordID, tabulatorID):
    
        self.content = {
            "TabulatorId": tabulatorID,
            "BatchId": batchID,
            "RecordId": recordID,
            "CountingGroupId": 1,
            "ImageMask": "D:\\NAS\\2023 BoCo UAT Test Election\\Results\\Tabulator00105\\Batch001\\Images\\00105_00001_000041*.*",
            "SessionType": "ScannedVote",
            "VotingSessionIdentifier": "",
            "UniqueVotingIdentifier": "",
            "Original": {
                "PrecinctPortionId": 0,
                "BallotTypeId": 1,
                "IsCurrent": True,
                "Cards": [
                    {
                        "Id": 1092,
                        "KeyInId": 1092,
                        "PaperIndex": 0,
                        "Contests": [
                            {
                                "Id": 1,
                                "ManifestationId": 16,
                                "Undervotes": 0,
                                "Overvotes": 0,
                                "OutstackConditionIds": [],
                                "Marks": [
                                    {
                                        "CandidateId": 2,
                                        "ManifestationId": 67,
                                        "PartyId": 0,
                                        "Rank": 1,
                                        "MarkDensity": 100,
                                        "IsAmbiguous": False,
                                        "IsVote": True,
                                        "OutstackConditionIds": []
                                    },
                                    {
                                        "CandidateId": 1,
                                        "ManifestationId": 69,
                                        "PartyId": 0,
                                        "Rank": 2,
                                        "MarkDensity": 96,
                                        "IsAmbiguous": False,
                                        "IsVote": True,
                                        "OutstackConditionIds": []
                                    },
                                    {
                                        "CandidateId": 3,
                                        "ManifestationId": 74,
                                        "PartyId": 0,
                                        "Rank": 3,
                                        "MarkDensity": 96,
                                        "IsAmbiguous": False,
                                        "IsVote": True,
                                        "OutstackConditionIds": []
                                    }
                                ]
                            },
                            {
                                "Id": 2,
                                "ManifestationId": 17,
                                "Undervotes": 0,
                                "Overvotes": 0,
                                "OutstackConditionIds": [
                                    14
                                ],
                                "Marks": [
                                    {
                                        "CandidateId": 7,
                                        "ManifestationId": 75,
                                        "PartyId": 0,
                                        "Rank": 1,
                                        "MarkDensity": 98,
                                        "IsAmbiguous": False,
                                        "IsVote": True,
                                        "OutstackConditionIds": []
                                    },
                                    {
                                        "CandidateId": 8,
                                        "ManifestationId": 88,
                                        "PartyId": 0,
                                        "Rank": 2,
                                        "MarkDensity": 99,
                                        "IsAmbiguous": False,
                                        "IsVote": True,
                                        "OutstackConditionIds": []
                                    }
                                ]
                            },
                            {
                                "Id": 10,
                                "ManifestationId": 18,
                                "Undervotes": 1,
                                "Overvotes": 0,
                                "OutstackConditionIds": [
                                    4,
                                    6
                                ],
                                "Marks": []
                            },
                            {
                                "Id": 11,
                                "ManifestationId": 19,
                                "Undervotes": 1,
                                "Overvotes": 0,
                                "OutstackConditionIds": [
                                    4,
                                    6
                                ],
                                "Marks": []
                            },
                            {
                                "Id": 12,
                                "ManifestationId": 20,
                                "Undervotes": 1,
                                "Overvotes": 0,
                                "OutstackConditionIds": [
                                    4,
                                    6
                                ],
                                "Marks": []
                            },
                            {
                                "Id": 13,
                                "ManifestationId": 21,
                                "Undervotes": 1,
                                "Overvotes": 0,
                                "OutstackConditionIds": [
                                    4,
                                    6
                                ],
                                "Marks": []
                            },
                            {
                                "Id": 14,
                                "ManifestationId": 22,
                                "Undervotes": 1,
                                "Overvotes": 0,
                                "OutstackConditionIds": [
                                    4,
                                    6
                                ],
                                "Marks": []
                            },
                            {
                                "Id": 15,
                                "ManifestationId": 23,
                                "Undervotes": 1,
                                "Overvotes": 0,
                                "OutstackConditionIds": [
                                    4,
                                    6
                                ],
                                "Marks": []
                            },
                            {
                                "Id": 16,
                                "ManifestationId": 24,
                                "Undervotes": 1,
                                "Overvotes": 0,
                                "OutstackConditionIds": [
                                    4,
                                    6
                                ],
                                "Marks": []
                            },
                            {
                                "Id": 17,
                                "ManifestationId": 25,
                                "Undervotes": 1,
                                "Overvotes": 0,
                                "OutstackConditionIds": [
                                    4,
                                    6
                                ],
                                "Marks": []
                            }
                        ],
                        "OutstackConditionIds": []
                    }
                ]
            }
        }

class BallotB:
    def __init__(self, batchID, recordID, tabulatorID):
    
        self.content = {
            "TabulatorId": tabulatorID,
            "BatchId": batchID,
            "RecordId": recordID,
            "CountingGroupId": 1,
            "ImageMask": "D:\\NAS\\2023 BoCo UAT Test Election\\Results\\Tabulator00105\\Batch001\\Images\\00105_00001_000041*.*",
            "SessionType": "ScannedVote",
            "VotingSessionIdentifier": "",
            "UniqueVotingIdentifier": "",
            "Original": {
                "PrecinctPortionId": 0,
                "BallotTypeId": 1,
                "IsCurrent": True,
                "Cards": [
                    {
                        "Id": 1092,
                        "KeyInId": 1092,
                        "PaperIndex": 0,
                        "Contests": [
                            {
                                "Id": 1,
                                "ManifestationId": 16,
                                "Undervotes": 0,
                                "Overvotes": 0,
                                "OutstackConditionIds": [],
                                "Marks": [
                                    {
                                        "CandidateId": 2,
                                        "ManifestationId": 67,
                                        "PartyId": 0,
                                        "Rank": 2,
                                        "MarkDensity": 100,
                                        "IsAmbiguous": False,
                                        "IsVote": True,
                                        "OutstackConditionIds": []
                                    },
                                    {
                                        "CandidateId": 1,
                                        "ManifestationId": 69,
                                        "PartyId": 0,
                                        "Rank": 1,
                                        "MarkDensity": 96,
                                        "IsAmbiguous": False,
                                        "IsVote": True,
                                        "OutstackConditionIds": []
                                    },
                                    {
                                        "CandidateId": 3,
                                        "ManifestationId": 74,
                                        "PartyId": 0,
                                        "Rank": 3,
                                        "MarkDensity": 96,
                                        "IsAmbiguous": False,
                                        "IsVote": True,
                                        "OutstackConditionIds": []
                                    }
                                ]
                            },
                            {
                                "Id": 2,
                                "ManifestationId": 17,
                                "Undervotes": 0,
                                "Overvotes": 0,
                                "OutstackConditionIds": [
                                    14
                                ],
                                "Marks": [
                                    {
                                        "CandidateId": 7,
                                        "ManifestationId": 75,
                                        "PartyId": 0,
                                        "Rank": 1,
                                        "MarkDensity": 98,
                                        "IsAmbiguous": False,
                                        "IsVote": True,
                                        "OutstackConditionIds": []
                                    },
                                    {
                                        "CandidateId": 8,
                                        "ManifestationId": 88,
                                        "PartyId": 0,
                                        "Rank": 2,
                                        "MarkDensity": 99,
                                        "IsAmbiguous": False,
                                        "IsVote": True,
                                        "OutstackConditionIds": []
                                    }
                                ]
                            },
                            {
                                "Id": 10,
                                "ManifestationId": 18,
                                "Undervotes": 1,
                                "Overvotes": 0,
                                "OutstackConditionIds": [
                                    4,
                                    6
                                ],
                                "Marks": []
                            },
                            {
                                "Id": 11,
                                "ManifestationId": 19,
                                "Undervotes": 1,
                                "Overvotes": 0,
                                "OutstackConditionIds": [
                                    4,
                                    6
                                ],
                                "Marks": []
                            },
                            {
                                "Id": 12,
                                "ManifestationId": 20,
                                "Undervotes": 1,
                                "Overvotes": 0,
                                "OutstackConditionIds": [
                                    4,
                                    6
                                ],
                                "Marks": []
                            },
                            {
                                "Id": 13,
                                "ManifestationId": 21,
                                "Undervotes": 1,
                                "Overvotes": 0,
                                "OutstackConditionIds": [
                                    4,
                                    6
                                ],
                                "Marks": []
                            },
                            {
                                "Id": 14,
                                "ManifestationId": 22,
                                "Undervotes": 1,
                                "Overvotes": 0,
                                "OutstackConditionIds": [
                                    4,
                                    6
                                ],
                                "Marks": []
                            },
                            {
                                "Id": 15,
                                "ManifestationId": 23,
                                "Undervotes": 1,
                                "Overvotes": 0,
                                "OutstackConditionIds": [
                                    4,
                                    6
                                ],
                                "Marks": []
                            },
                            {
                                "Id": 16,
                                "ManifestationId": 24,
                                "Undervotes": 1,
                                "Overvotes": 0,
                                "OutstackConditionIds": [
                                    4,
                                    6
                                ],
                                "Marks": []
                            },
                            {
                                "Id": 17,
                                "ManifestationId": 25,
                                "Undervotes": 1,
                                "Overvotes": 0,
                                "OutstackConditionIds": [
                                    4,
                                    6
                                ],
                                "Marks": []
                            }
                        ],
                        "OutstackConditionIds": []
                    }
                ]
            }
        }

cvrSourceFile = open('CvrExport.json', 'r')    
cvrData = json.load(cvrSourceFile)
cvrSourceFile.close()

while ballotsNeeded > 0:
    if ctrRecordID > batchSizeLimit:
        ctrRecordID = 1
        ctrBatchID += 1
    else:
        ctrRecordID += 1

    # Create a close contest by flipping between A and B each round.
    if strBallot == 1:
        newBallot = BallotA(ctrBatchID, ctrRecordID, intTabulatorID)
        strBallot = 2
    else:
        newBallot = BallotB(ctrBatchID, ctrRecordID, intTabulatorID)
        strBallot = 1

    cvrData["Sessions"].append(newBallot.content)
    ballotsNeeded -= 1
    del newBallot

with open("AugmentedCvrExport.json", 'w') as augmentedCVRExportFile:
    augmentedCVRExportFile.write(json.dumps(cvrData))
augmentedCVRExportFile.close()
