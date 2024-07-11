function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("data-include");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                // console.log(this)
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute("data-include");
                    includeHTML();
                }
            }
            xhttp.open("GET", file + '.html', true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
}

includeHTML();



function fixCapitalsText(text) {
    result = "";
    sentenceStart = true;
    for (i = 0; i < text.length; i++) {
        ch = text.charAt(i);
        if (sentenceStart && ch.match(/^\S$/)) {
            ch = ch.toUpperCase();
            sentenceStart = false;
        } else {
            ch = ch.toLowerCase();
        }
        if (ch.match(/^[.!?]$/)) {
            sentenceStart = true;
        }
        result += ch;
    }
    return result;
}

setTimeout(() => {
    //   var multipleCancelButton = new Choices('#choices-multiple-remove-button', {
    //       removeItemButton: true,
    //       maxItemCount:5,
    //       searchResultLimit:5,
    //       renderChoiceLimit:5
    //   });
    // $('#multiple-checkboxes').multiselect();
}, 500);
setTimeout(() => {
    // $('#DDLActivites').on('hide.bs.dropdown', function () {
    //     return false;
    // });


    // $(document).ready(function() {  
    //     $('#multiple-checkboxes').multiselect();  
    // });

    let hText = $("#breadcrumbs").text();
    //   $("#breadcrumbs").text(hText + ' / '+ $("#collapseShipperBmcLink").text());			
    $("#collapseShipperBmc").addClass("show");
    $("#collapseShipperBmcLink").addClass("active");
    $("#collapseShipperBmcLink").attr({ "aria-expanded": true });
    $("#collapseShipperBmcIcon").removeClass("fa-angle-down").addClass("fa-angle-right color-yellow");
    $("#collapseShipperBmcIcon").attr({ "aria-hidden": false });

    $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 15,
        nav: true,
        dots: false,
        // navText:["<div class='nav-btn prev-slide'><img src='assets/images/prev.png' style='margin-right: 3px;height: 10px;' />Prev</div>","<div class='nav-btn next-slide'>Next<img src='assets/images/next.png' style='margin-left: 3px;height: 10px;' /></div>"],
        navText: ['<div class="nav-btn prev-slide"><i class="fas fa-angle-left f-14" style="margin-right: 4px; margin-top: 1px;"></i>Prev</div>', '<div class="nav-btn next-slide">Next<i class="fas fa-angle-right f-14" style="margin-left: 4px; margin-top: 1px;"></i></div>'],
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            1000: {
                items: 2
            }
        }
    })

    // charts

    Highcharts.chart('my-rate-ranking-chart', {
        chart: {
            type: 'pie'
        },
        title: false,
        plotOptions: {
            pie: {
                colors: [
                    '#C00500',
                    '#D05E7E',
                    '#B2B9BE',
                    '#13A6AA',
                    '#377989'
                ],
                size: 181,
                innerSize: 135,
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    x: -14,
                    y: 32,
                    format: "TEU",
                    style: {
                        fontWeight: '500',
                        color: '#132E67',
                        fontSize: '16px'
                    },
                    filter: {
                        property: 'name',
                        operator: '===',
                        value: 'Highest'
                    }
                },
                showInLegend: true
            }
        },
        tooltip: {
            headerFormat: '',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
                'Area (square km): <b>{point.y}</b><br/>' +
                'Population density (people per square km): <b>{point.z}</b><br/>'
        },
        legend: {
            align: 'left',
            layout: 'vertical',
            verticalAlign: 'middle',
            symbolPadding: 0,
            symbolWidth: 0.1,
            symbolHeight: 0.1,
            symbolRadius: 0,
            useHTML: true,
            labelFormatter: function () {
                return '<div style="width: max-content;"><span style="display: inline-block; margin-right: 5px; width: 19px; height: 10px; border-radius:2px; line-height: 12px; margin-top: 11px; background-color:' + this.color + ';"></span><span style="display: inline-block; line-height: 12px; margin-top: 11px; margin-bottom: 11px;">' + this.name + ": " + this.y + '%</span></div>';
            },
            itemStyle: {
                color: '#6C758A',
                fontSize: '12px',
                fontWeight: '300'
            }
        },
        series: [{
            zMin: 0,
            name: 'countries',
            data: [{
                name: "Highest", y: 2379
            }, {
                name: "High", y: 1945
            }, {
                name: "Average", y: 4856
            }, {
                name: "Low", y: 5567
            }, {
                name: "Lowest", y: 3945
            }]
        }]
    });

    Highcharts.chart('my-spend-and-saving-chart', {
        chart: {
            type: 'pie'
        },
        title: false,
        plotOptions: {
            pie: {
                colors: [
                    '#132E67',
                    '#13A6AA'
                ],
                size: 181,
                innerSize: 135,
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    x: -24,
                    y: -24,
                    format: `Spend & Savings`,
                    style: {
                        fontWeight: '500',
                        color: '#132E67',
                        fontSize: '16px'
                    },
                    filter: {
                        property: 'name',
                        operator: '===',
                        value: 'Total Spend'
                    }
                },
                showInLegend: true
            }
        },
        tooltip: {
            headerFormat: '',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
                'Area (square km): <b>{point.y}</b><br/>' +
                'Population density (people per square km): <b>{point.z}</b><br/>'
        },
        legend: {
            align: 'left',
            layout: 'vertical',
            verticalAlign: 'middle',
            symbolPadding: 0,
            symbolWidth: 0.1,
            symbolHeight: 0.1,
            symbolRadius: 0,
            useHTML: true,
            labelFormatter: function () {
                return '<div style="width: max-content;"><span style="display: inline-block; margin-right: 5px; width: 19px; height: 10px; border-radius:2px; line-height: 12px; margin-bottom: 16px; background-color:' + this.color + ';"></span><span style="display: inline-block; line-height: 12px; margin-top: 11px; margin-bottom: 11px;">' + this.name + '<br/><span style="font-size: 12px; font-weight: 600; line-height: 24px; display: block;"> $' + this.y + '</span></span></div>';
            },
            itemStyle: {
                color: '#6C758A',
                fontSize: '12px',
                fontWeight: '300'
            }
        },
        series: [{
            zMin: 0,
            name: 'countries',
            data: [{
                name: "Total Spend", y: 402344
            }, {
                name: "Potential Savings", y: 209050
            }]
        }]
    });

    Highcharts.chart('my-transit-time-chart', {
        chart: {
            type: 'pie'
        },
        title: false,
        plotOptions: {
            pie: {
                colors: [
                    '#13A6AA',
                    '#B2B9BE',
                    '#C00500',
                    '#788096'
                ],
                size: 181,
                innerSize: 135,
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    x: -34,
                    y: 16,
                    format: `Transit Time`,
                    style: {
                        fontWeight: '500',
                        color: '#132E67',
                        fontSize: '16px'
                    },
                    filter: {
                        property: 'name',
                        operator: '===',
                        value: 'Faster'
                    }
                },
                showInLegend: true
            }
        },
        tooltip: {
            headerFormat: '',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
                'Area (square km): <b>{point.y}</b><br/>' +
                'Population density (people per square km): <b>{point.z}</b><br/>'
        },
        legend: {
            align: 'left',
            layout: 'vertical',
            verticalAlign: 'middle',
            symbolPadding: 0,
            symbolWidth: 0.1,
            symbolHeight: 0.1,
            symbolRadius: 0,
            useHTML: true,
            labelFormatter: function () {
                return '<div style="width: max-content;"><span style="display: inline-block; margin-right: 5px; width: 19px; height: 10px; border-radius:2px; line-height: 12px; margin-top: 11px; background-color:' + this.color + ';"></span><span style="display: inline-block; line-height: 12px; margin-top: 11px; margin-bottom: 11px;">' + this.name + ": " + this.y + '</span></div>';
            },
            itemStyle: {
                color: '#6C758A',
                fontSize: '12px',
                fontWeight: '300'
            }
        },
        series: [{
            zMin: 0,
            name: 'countries',
            data: [{
                name: "Faster", y: 250
            }, {
                name: "Average", y: 80
            }, {
                name: "Slower", y: 420
            }, {
                name: "No data", y: 15
            }]
        }]
    });

    Highcharts.chart('my-free-time-chart', {
        chart: {
            type: 'pie'
        },
        title: false,
        plotOptions: {
            pie: {
                colors: [
                    '#13A6AA',
                    '#B2B9BE',
                    '#C00500',
                    '#788096'
                ],
                size: 181,
                innerSize: 135,
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    x: -34,
                    y: 16,
                    format: `Free time`,
                    style: {
                        fontWeight: '500',
                        color: '#132E67',
                        fontSize: '16px'
                    },
                    filter: {
                        property: 'name',
                        operator: '===',
                        value: 'Shorter'
                    }
                },
                showInLegend: true
            }
        },
        tooltip: {
            headerFormat: '',
            pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
                'Area (square km): <b>{point.y}</b><br/>' +
                'Population density (people per square km): <b>{point.z}</b><br/>'
        },
        legend: {
            align: 'left',
            layout: 'vertical',
            verticalAlign: 'middle',
            symbolPadding: 0,
            symbolWidth: 0.1,
            symbolHeight: 0.1,
            symbolRadius: 0,
            useHTML: true,
            labelFormatter: function () {
                return '<div style="width: max-content;"><span style="display: inline-block; margin-right: 5px; width: 19px; height: 10px; border-radius:2px; line-height: 12px; margin-top: 11px; background-color:' + this.color + ';"></span><span style="display: inline-block; line-height: 12px; margin-top: 11px; margin-bottom: 11px;">' + this.name + ": " + this.y + '</span></div>';
            },
            itemStyle: {
                color: '#6C758A',
                fontSize: '12px',
                fontWeight: '300'
            }
        },
        series: [{
            zMin: 0,
            name: 'countries',
            data: [{
                name: "Shorter", y: 250
            }, {
                name: "Average", y: 80
            }, {
                name: "Longer", y: 420
            }, {
                name: "No data", y: 15
            }]
        }]
    });

    Highcharts.chart('time-series', {
        title: false,
        yAxis: {
            title: {
                enabled: false
            }
        },

        xAxis: {
            title: {
                enabled: false
            },
            labels: {
                enabled: false
            }
        },

        legend: {
            enabled: false
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 2010
            }
        },

        series: [{
            name: 'Installation',
            data: [800, 600, 750, 100, 250]
        }, {
            name: 'Manufacturing',
            data: [250, 400, 750, 300, 150]
        }, {
            name: 'Sales & Distribution',
            data: [150, 100, 70, 200, 120]
        }, {
            name: 'Project Development',
            data: [350, 500, 350, 1000, 1150]
        }, {
            name: 'Other',
            data: [50, 200, 600, 100, 150]
        }]
    });

    Highcharts.chart('time-series-chart', {
        title: false,
        yAxis: {
            title: {
                enabled: false
            }
        },

        xAxis: {
            title: {
                enabled: false
            },
            labels: {
                enabled: false
            }
        },

        legend: {
            enabled: false
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 2010
            }
        },

        series: [{
            name: 'Installation',
            data: [800, 600, 750, 100, 250]
        }, {
            name: 'Manufacturing',
            data: [250, 400, 750, 300, 150]
        }, {
            name: 'Sales & Distribution',
            data: [150, 100, 70, 200, 120]
        }, {
            name: 'Project Development',
            data: [350, 500, 350, 1000, 1150]
        }, {
            name: 'Other',
            data: [50, 200, 600, 100, 150]
        }]
    });
}, 500);