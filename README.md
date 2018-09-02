# Prices Display Demo (Grid & Chart)


A simple demo responsive website that shows how to provide the user information about the price of 6 types of Cheese according to its oldness. The data will be shown, in the same page, in a grid as well as in a line graph across these 6 types.


## Project Anatomy

- Database: The project Provides 2 options as data source: **JSON file** and **SQLite Database**. 

-	A .net back-end that is callable via a simple Web API call to get the data

-	AngularJS front-end that has a grid + a chart ([chartjs](http://www.chartjs.org)) based on the data returned by back end

- Gulp task runner to transpile JS files,  add vendor prefixes to CSS rules,  and apply minification, bundling and source-map generation for JS and CSS files, and that's during the development


### Notes

* The front-end and the back-end are in the same project, BUT they are *loosely coupled* and can be separated in real work

* This project used:

    * Visual studio 2015
    * .NET Framework 4.6.2
    * System.Data.SQLite 1.0 downloaded from NUGET

* We can use [DB Browser](http://sqlitebrowser.org/) to have SQLite IDE to easily manipulate data



**To be mentioned:** the source of the cheese image used in the site is: [kuwaitprices](http://www.kuwaitprices.com/product/egyptian-roomy-cheese-500-gm.html)