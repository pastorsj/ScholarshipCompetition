import pandas as pd
import requests
import re

# contracts_df = pd.read_csv('./CleanedContracts/cleaned_contracts.csv')
# print(contracts_df.head())
# print(contracts_df.columns)

# contracts_of_interest = ["CONT_AWD_HR001117C0025_9700_-NONE-_-NONE-"]

# energy_keywords = ['solar', 'wind', 'renewable', 'thermal', 'hydroelectric',
#                    'biomass', 'hydropower', 'ethanol', 'methanol']
# energy_regex = re.compile('|'.join(energy_keywords), re.IGNORECASE)

# secondary_energy_keywords = ['energy', 'storage']
# secondary_energy_regex = re.compile(
#     '|'.join(secondary_energy_keywords), re.IGNORECASE)

# remove_keywords = ['windows']
# remove_filter_regex = re.compile(
#     '|'.join(remove_keywords), re.IGNORECASE)

# energy_filtered_df = contracts_df[contracts_df['award_description'].apply(
#     lambda x: bool(energy_regex.search(x)) if x and isinstance(x, str) else False)]

# print('Results after first filter')
# print(energy_filtered_df.head())
# print(len(energy_filtered_df))

# energy_filtered_df = energy_filtered_df[energy_filtered_df['award_description'].apply(
#     lambda x: bool(secondary_energy_regex.search(x)) if x and isinstance(x, str) else False)]

# print('Results after second filter')
# print(energy_filtered_df.head())
# print(len(energy_filtered_df))

# energy_filtered_df = energy_filtered_df[energy_filtered_df['award_description'].apply(
#     lambda x: not bool(remove_filter_regex.search(x)) if x and isinstance(x, str) else False)]

# print('Results after final filter')
# print(energy_filtered_df.head())
# print(len(energy_filtered_df))

# energy_filtered_df.to_csv(
#     './CleanedContracts/energy_contracts.csv', index=False)


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
    return pd.json_normalize(output)


energy_contracts_df = pd.read_csv('./CleanedContracts/energy_contracts.csv')

sub_contracts_df = pd.DataFrame()
for contract_id in set(energy_contracts_df['contract_award_unique_key'].tolist()):
    sub_contracts = get_sub_awards(contract_id)
    sub_contracts_df = pd.concat([sub_contracts_df, sub_contracts])

print('All subawards', sub_contracts_df)
print('Total number of sub contracts', len(sub_contracts_df))

sub_contracts_df.to_csv('./CleanedContracts/energy_subcontracts.csv', index=False)