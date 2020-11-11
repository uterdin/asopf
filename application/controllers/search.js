const Search = require('../models/search');
var fs = require("fs");
const { dirname } = require('path');
var lodash = require('lodash');

exports.covid = (req, res, next) => {
    Search.getNewCovidData('covid_data').then(([rows, fields]) => {
        var rawdata = fs.readFileSync(__dirname + "/counties.json");
        let data = JSON.parse(rawdata);
        data.features.forEach(function(table) {
            var picked = lodash.filter(rows, x => x.county_code === table.attributes.name);
            let tmp = JSON.parse(JSON.stringify(picked[0]));
            table.attributes["total_cases"] = tmp.total_cases;
            table.attributes["total_deaths"] = tmp.total_deaths;
            table.attributes["cases"] = tmp.cases;
            table.attributes["death"] = tmp.death;
        });
        res.render('covid', {
            pageTitle: 'ASOPF | COVID Data',
            path: '/covid',
            countyInit: false,
            counties: data
        });
    }).catch(err => console.log(err));
};

exports.countyInit = (req, res, next) => {
    let countyString = req.params.county;
    var data;
    // Build the map as per usual
    Search.getNewCovidData('covid_data')
    .then(([rows, fields]) => {
        let rawdata = fs.readFileSync(__dirname + "/counties.json");
        let data2 = {};
        data = JSON.parse(rawdata);
        data.features.forEach(function(table) {
            let picked = lodash.filter(rows, x => x.county_code === table.attributes.name);
            let tmp = JSON.parse(JSON.stringify(picked[0]));
            table.attributes["total_cases"] = tmp.total_cases;
            table.attributes["total_deaths"] = tmp.total_deaths;
            table.attributes["cases"] = tmp.cases;
            table.attributes["death"] = tmp.death;
        });
        Search.getCountyCovid(countyString)
        .then(([rows, fields]) => { 
            res.render('covid', {
                pageTitle: `ASOPF | ${countyString} | COVID Data`,
                path: '/covid',
                countyInit: true,
                counties: data,
                dataTable: rows,
                county: countyString
            });
        });
    }).catch(err => console.log(err));

    
};

