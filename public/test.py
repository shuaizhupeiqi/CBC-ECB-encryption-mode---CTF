import csv
import json

import csv
import json


def convert_csv_to_json(csv_file_path, json_file_path):
    # Open the CSV file
    with open(csv_file_path, 'r') as csv_file:
        # Parse the CSV data
        csv_data = csv.DictReader(csv_file)
        # Convert the CSV data to a list of dictionaries
        data_list = list(csv_data)
    # Open the JSON file
    with open(json_file_path, 'w') as json_file:
        # Write the JSON data to the file
        json.dump(data_list, json_file, indent=4)


convert_csv_to_json('postcodes.csv', 'postcodes.json')


def remove_last_key(json_file_path, new_json_file_path):
    # Open the JSON file
    with open(json_file_path, 'r') as json_file:
        # Load the JSON data
        data = json.load(json_file)
        # Loop through each dictionary in the data and remove the last key
        for d in data:
            last_key = list(d.keys())[-1]
            del d[last_key]
    # Write the modified data to a new JSON file
    with open(new_json_file_path, 'w') as new_json_file:
        json.dump(data, new_json_file, indent=4)


# Example usage
remove_last_key('postcodes.json', 'new_data.json')
