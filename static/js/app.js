// Load the JSON data from the URL
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Function to initialize the dashboard
function init() {
    d3.json(url).then(data => {
        // Populate dropdown menu
        let dropdown = d3.select("#selDataset");
        data.names.forEach(name => {
            dropdown.append("option").text(name).property("value", name);
        });

        // Initialize with the first sample
        const firstSample = data.names[0];
        updateCharts(firstSample);
        updateMetadata(firstSample);
    });
}

// Function to update the bar and bubble charts
function updateCharts(sampleID) {
    d3.json(url).then(data => {
        const sample = data.samples.filter(s => s.id === sampleID)[0];

        // Bar chart
        let barData = [
            {
                x: sample.sample_values.slice(0, 10).reverse(),
                y: sample.otu_ids.slice(0, 10).map(otu => `OTU ${otu}`).reverse(),
                text: sample.otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h"
            }
        ];
        let barLayout = {
            title: "Top 10 OTUs",
            margin: { t: 30, l: 150 }
        };
        Plotly.newPlot("bar", barData, barLayout);

        // Bubble chart
        let bubbleData = [
            {
                x: sample.otu_ids,
                y: sample.sample_values,
                text: sample.otu_labels,
                mode: "markers",
                marker: {
                    size: sample.sample_values,
                    color: sample.otu_ids,
                    colorscale: "Earth"
                }
            }
        ];
        let bubbleLayout = {
            title: "OTU Distribution",
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample Value" },
            margin: { t: 30 }
        };
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
}

// Function to update the metadata
function updateMetadata(sampleID) {
    d3.json(url).then(data => {
        const metadata = data.metadata.filter(meta => meta.id.toString() === sampleID)[0];
        let metadataPanel = d3.select("#sample-metadata");
        metadataPanel.html("");
        Object.entries(metadata).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });
    });
}

// Function to handle dropdown change
function optionChanged(newSampleID) {
    updateCharts(newSampleID);
    updateMetadata(newSampleID);
}

// Initialize the dashboard
init();