import pandas as pd
import requests

contracts_df = pd.read_csv('./CleanedContracts/cleaned_contracts.csv')
print(contracts_df.head())

contracts_of_interest = ["CONT_AWD_HR001117C0025_9700_-NONE-_-NONE-"]


def get_sub_awards(award_id):

    # initialization
    has_next_page = True
    page = 1
    output = []

    print("Retrieving subawards for ", award_id)
    while has_next_page:

        # parameters for request
        payload = {
            "sort": "subaward_number",
            "order": "desc",
            "award_id": award_id,
            "page": page,
            "limit": 100
        }

        # run the request
        response = requests.post(
            'https://api.usaspending.gov/api/v2/subawards/', data=payload).json()

        # add response data to output
        output += response['results']

        # handle pagination
        has_next_page = response['page_metadata']['hasNext']
        page += 1

    print("Retrieved ", len(output), " subawards for ", award_id)
    return output


get_sub_awards(contracts_of_interest[0])
