import xml.etree.ElementTree as ET
import json

# Load the XML file
tree = ET.parse('eat-stimulus-response.xml')
root = tree.getroot()

# Create a dictionary to store the data
data = {
    'eat-stimulus-response': []
}

# Iterate through each 'stimulus' element
for stimulus in root.findall('.//stimulus'):
    stimulus_data = {
        'word': stimulus.get('word'),
        'all': stimulus.get('all'),
        'diff': stimulus.get('diff'),
        'responses': []
    }
    
    # Iterate through 'response' elements within each 'stimulus'
    for response in stimulus.findall('.//response'):
        response_data = {
            'word': response.get('word'),
            'n': response.get('n'),
            'r': response.get('r')
        }
        stimulus_data['responses'].append(response_data)
    
    data['eat-stimulus-response'].append(stimulus_data)

# Convert the data to JSON and write to a file
with open('output.json', 'w') as json_file:
    json.dump(data, json_file, indent=4)

print("XML to JSON conversion complete. Output saved to 'output.json'.")
