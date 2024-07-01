# Azure Firewall Rules Analyzer

This is a simple web application for analyzing Azure Firewall rules. It allows you to import Azure Firewall Policy in JSON format and displays the rules in a sorted table.

## Files

- `index.html`: The main HTML file that structures the web page.
- `styles.css`: Contains all the CSS styles used in the web page.
- `script.js`: Contains all the JavaScript code that powers the functionality of the web page.

## Usage

1. Go to Azure Firewall Policy in the Azure Portal.
2. Choose `Export template` in the left blade.
3. Download the template and extract it's content locally.
1. Open `index.html` in your web browser.
2. Click on the file input button and select your Azure Firewall Policy JSON file called `template.json` you extracted.
3. The application will parse the JSON file and display the firewall rules in a sorted table.

## Functions

- `displaySortedRules(json)`: Parses the JSON content and displays the sorted rules.
- `extractGroupName(groupName)`: Extracts the group name from a string.
- `sortRules(rules)`: Sorts the rules based on group and collection priorities.
- `displayRulesInTable(rules)`: Displays the sorted rules in a table.

## Styles

The CSS file `styles.css` contains styles for the body, headings, paragraphs, file input button, table, and specific classes for different rule types and actions.

## Note

This is a simple application and does not handle all possible edge cases. Always double-check the results.# AzureFirewallRuleAnalyzer
