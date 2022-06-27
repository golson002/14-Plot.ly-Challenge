// Define URL for data
const samples = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

// Fetch the JSON data and console log it
d3.json(samples).then((data) => {
    console.log(data)

    // Load the "names" data for the dropdown menu
    var name = data.names;
    d3.select('#selDataset').selectAll('option').data(name).enter().append('option').text((data) => {
        return data;
    });
});

// Create a function to create the plots and populate the Demographics table when the user selects a name
function optionChanged(value) {
    d3.json(samples).then((data) => {
        var samp_values = data.samples;
        var otuIDs = [];
        var sampleValues = [];
        var otuLabels = [];
        var otuArray = [];

        // Loop through the samples array and pull the data for the selected "name"
        samp_values.forEach(individual => {
            if(individual.id == value) {
                otuIDs = individual.otu_ids;
                sampleValues = individual.sample_values;
                otuLabels = individual.otu_labels;
                otuIDs.map(otuSelection => {
                    otuArray.push(`OTU: ${otuSelection}`);
                });
            }
        });
    
        // Pull the metadata for the selected "name" and populate the Demographics table
        var washes = 0;
        var metadata = data.metadata;
        metadata.forEach(individual => {
            if(individual.id == value){
                var details = Object.entries(individual);
                washes = details[6][1];
                d3.select('#sample-metadata').selectAll('p').data(details).enter().append('p').text(info => {
                    return `${info[0]}: ${info[1]}`;
                });
            }
        });

        // Horizontal bar chart based on "name" selection
        let top_ten = sampleValues.slice(0,10).reverse()
        let top_ten_ids = otuArray.slice(0,10).reverse()
        let bar_text = otuLabels.slice(0,10).reverse()

        var bar_trace = {
            x: top_ten,
            y: top_ten_ids,
            type: 'bar', 
            orientation: 'h',
            text: bar_text
        }

        var bar_data = [bar_trace];

        var bar_layout = {
            title: "Top Ten OTUs Present for Test Subject", 
            height: 500,
            width: 550
        }

        Plotly.newPlot('bar', bar_data, bar_layout);
        
        // Bubble chart for each OTU based on "name" selection
        var bubble_trace = {
            x: otuIDs,
            y: sampleValues,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color:otuIDs,
                colorscale: 'YlGnBu'
            },
            text: otuLabels
        }

        var bubble_data = [bubble_trace];

        var bubble_layout = {
            title: "All OTUs Present for Test Subject", 
            xaxis: {
                title: "OTU ID"
            }
        }

        Plotly.newPlot('bubble', bubble_data, bubble_layout);

        // Guage chart to plot washing frequency for "name" selected 
        var gauge_trace = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: washes,
              title: "Belly Button Washing Frequency",
              type: "indicator",
              mode: "gauge+number+delta",
              delta: {reference: 9, 'increasing': {color: "red"}},
              gauge: {
                axis: { range: [null, 9] },
                bar: {color: "50acb3"}, 
                    steps: [
                        { range: [0,1], color: "f5f6f4" },
                        { range: [1,2], color: "ecf5e4" },
                        { range: [2,3], color: "e8f5dc" },
                        { range: [3,4], color: "e2f5d0" },
                        { range: [4,5], color: "cdf2aa" },
                        { range: [5,6], color: "9fd46e" },
                        { range: [6,7], color: "88c94b" },
                        { range: [7,8], color: "27b83f" },
                        { range: [8,9], color: "108f3c" },
                        ]},
            }
          ];
          
          var gauge_data = [gauge_trace];

          var gauge_layout = { 
              width: 600, height: 500, margin: { t: 20, b: 40, l:140, r:140 } 
            };

          Plotly.newPlot('gauge', gauge_data, gauge_layout);
    
    });
}

