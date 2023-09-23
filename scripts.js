let w = 920;
let h = 630;

let padding = 40;

let tooltip = d3.select("#tooltip");

let svg = d3.select("body")
            .append("svg")
            .attr("height", h + padding +padding)
            .attr("width", w + padding + padding);
const timeToDate = (d) => {
    let date = new Date(0);
    date.setMinutes(Number(d.Time.match(/\d+/)[0]));
    date.setSeconds(Number(d.Time.match(/\d+/g)[1]));
    return date
};

const formatSeconds = (inputSeconds) => {
    let seconds = inputSeconds % 60;
    let minutes = (inputSeconds - seconds) / 60;

    seconds = seconds < 10 ? "0"+seconds : seconds;
    
    return minutes+":"+seconds
}


fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then(response => response.json())
    .then(dataset => {
         let dateScale = d3.scaleTime([new Date(1993,3),new Date(2016,0)],[0,w]);
         // let timeScale = d3.scaleTime([minTime, maxTime], [h, padding]);
         let timeScale = d3.scaleLinear([d3.min(dataset, d => d.Seconds), d3.max(dataset, d => d.Seconds)], [padding, h]);

         let dateAxis = d3.axisBottom(dateScale);
         let timeAxis = d3.axisLeft(timeScale);
         timeAxis.tickFormat(d => formatSeconds(d));
        
         svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("cx", d => padding + dateScale(new Date(d.Year,0)))
        //    .attr("cy", d => h - timeScale(timeToDate(d)) + padding)
            .attr("cy", d => timeScale(d.Seconds) )
            .attr("r", 7)
            .attr("class","dot")
            .attr("fill", d => d.Doping == "" ? "rgba(150,0,0,0.5)" : "rgba(0,0,150,0.5)")
            .attr("data-xvalue", d => d.Year)
            .attr("data-yvalue", d => timeToDate(d))
            .on("mouseover",(e,d) => {
               tooltip.select(".basic-information").html(`${d.Name}: ${d.Nationality}<br>Date: ${d.Year}, Time: ${d.Time}`);
               tooltip.select(".doping").html(d.Doping);

               tooltip.attr("data-year",d.Year);

               tooltip.style("display","block");
               tooltip.style("left", e.pageX + 20 + "px");
               tooltip.style("top", e.pageY - 25 + "px");
            })
            .on("mouseout",() => {
               tooltip.style("display","none");
            });
         svg.append("g")
            .attr("id", "x-axis")
            .attr("transform",`translate(${padding}, ${h})`)
            .call(dateAxis)
         svg.append("g")
            .attr("id", "y-axis")
            .attr("transform",`translate(${padding}, ${0})`)
            .call(timeAxis)
         let legend = svg.append("g")
                         .attr("id", "legend")
                         .attr("transform", `translate(${w - 140},${h/2})`);
         legend.append("text")
               .text("No doping allegations")
               .attr("y", -12);
         legend.append("rect")
               .attr("width", "30")
               .attr("height", "30")
               .attr("x", 165)
               .attr("y", -34)
               .attr("fill","rgba(150,0,0,0.5)")

         legend.append("text")
               .text("Doping allegations")
               .attr("y", 18);
         legend.append("rect")
               .attr("width", "30")
               .attr("height", "30")
               .attr("x", 165)
               .attr("y", -4)
               .attr("fill","rgba(0,0,150,0.5)")
    });