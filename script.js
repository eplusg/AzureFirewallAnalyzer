document.getElementById('fileInput').addEventListener('change', function(event) {
    const fileInput = event.target;  // Get the file input element
    const file = fileInput.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        try {
            const json = JSON.parse(content);
            displaySortedRules(json);
        } catch (err) {
            console.error('Error parsing JSON file:', err);
            console.log('Content that failed to parse:', content);
            alert('Error parsing JSON file. Check the console for more details.');
        }
        // Reset the file input value
        fileInput.value = ''; 
    };
    reader.readAsText(file);
});
      
function displaySortedRules(json) {
    let natRules = [], networkRules = [], appRules = [];

    json.resources.forEach(resource => {
        if (resource.type === "Microsoft.Network/firewallPolicies/ruleCollectionGroups" && resource.properties && resource.properties.ruleCollections) {
            let groupName = extractGroupName(resource.name);
            const groupPriority = resource.properties.priority;

            resource.properties.ruleCollections.forEach(collection => {
                const collectionName = collection.name;
                const collectionPriority = collection.priority;
                const actionType = collection.action ? collection.action.type : 'Unknown'; // Correctly set the action type

                if (collection.rules) {
                    collection.rules.forEach(rule => {
                        // Construct a full rule object including the actionType
                        const fullRule = { groupName, groupPriority, collectionName, collectionPriority, rule, actionType };
                        
                        // Categorize rules based on their type
                        switch(rule.ruleType) {
                            case "NatRule":
                                natRules.push(fullRule);
                                break;
                            case "NetworkRule":
                                networkRules.push(fullRule);
                                break;
                            case "ApplicationRule":
                                appRules.push(fullRule);
                                break;
                        }
                    });
                }
            });
        }
    });

    // Sort each category of rules
    natRules = sortRules(natRules);
    networkRules = sortRules(networkRules);
    appRules = sortRules(appRules);

    // Combine all rules in the order: NAT -> Network -> Application
    const allRules = [...natRules, ...networkRules, ...appRules];

    // Display the rules in a table
    displayRulesInTable(allRules);
}


function extractGroupName(groupName) {
    if (groupName.includes('/')) {
        const parts = groupName.split('/');
        groupName = parts[parts.length - 1];
    }
    return groupName.replace("')]", "").trim();
}

function sortRules(rules) {
    return rules.sort((a, b) => {
        if (a.groupPriority !== b.groupPriority) {
            return a.groupPriority - b.groupPriority;
        }
        if (a.collectionPriority !== b.collectionPriority) {
            return a.collectionPriority - b.collectionPriority;
        }
        return 0; // Keep original order if priorities are the same
    });
}

function displayRulesInTable(rules) {
    const rulesList = document.getElementById('rulesList');
    rulesList.innerHTML = '';  // Clear existing content
    let order = 1;  // Initialize rule order

    rules.forEach(item => {
        // Extract and format rule details
        // Use item.actionType directly as it's already included in the rule object
        const actionType = item.actionType;
        const sourceAddresses = Array.isArray(item.rule.sourceAddresses) ? item.rule.sourceAddresses.join(', ') : 'N/A';
        const destinationPorts = Array.isArray(item.rule.destinationPorts) ? item.rule.destinationPorts.join(', ') : 'N/A';
        const ipProtocols = Array.isArray(item.rule.ipProtocols) ? item.rule.ipProtocols.join(', ') : 'N/A';
        
        // Check for FQDNs and Addresses
        const destinationAddresses = Array.isArray(item.rule.destinationAddresses) && item.rule.destinationAddresses.length > 0 
            ? item.rule.destinationAddresses.join(', ') 
            : (Array.isArray(item.rule.destinationFqdns) && item.rule.destinationFqdns.length > 0 ? item.rule.destinationFqdns.join(', ') : 'N/A');

        // Create a new table row element
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order++}</td>
            <td>${item.groupName}</td>
            <td>${item.groupPriority}</td>
            <td>${item.collectionName}</td>
            <td>${item.collectionPriority}</td>
            <td>${item.rule.name}</td>
            <td>${item.rule.ruleType}</td>
            <td>${sourceAddresses}</td>
            <td>${destinationPorts}</td>
            <td>${ipProtocols}</td>
            <td>${destinationAddresses}</td>
            <td>${actionType}</td>
        `;
        
        // Apply classes for styling based on rule type and action type
        row.classList.add(item.rule.ruleType.toLowerCase()); // Class based on rule type
        row.classList.add(item.actionType === 'Deny' ? 'deny-rule' : 'allow-rule'); // Class based on action type

        // Append the new row to the table body
        rulesList.appendChild(row);
    });

    // Make the table visible
    document.getElementById('rulesTable').style.display = 'table';
}

