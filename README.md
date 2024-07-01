# Azure Firewall Rules Analyzer

This is a simple web application for analyzing Azure Firewall rules. It allows you to import Azure Firewall Policy in JSON format and displays the rules in a sorted table.

## Usage

1. Go to Azure Firewall Policy in the Azure Portal.
2. Choose `Export template` in the left blade.
3. Download the template and extract it's content locally.
1. Open `index.html` in your web browser.
2. Click on the file input button and select your Azure Firewall Policy JSON file called `template.json` you extracted.
3. The application will parse the JSON file and display the firewall rules in a sorted table.
