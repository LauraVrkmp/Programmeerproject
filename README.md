## Programming project proposal: recreational drug use in Europe

I am aiming for a visualisation on recreational drug use in European countries from 2007 - 2014, addressing on the one hand drug specific topics of drug use prevalence, treatment demand, seizures and purity/potency of products, on the other hand non-drug specific topics death and disease, health and social responses in the form of needle and syringe programmes (NSPs), and substitution treatment (OST).

### Decomposition

The different data sets form a clear decomposed basis. By means of interactivity the data sets should complement each other. Intended features are a time slide, selecting countries, a menu for which data set to look into. Perhaps arcs/chord diagram for drug origins.

**Challenges** <br>
Trend vs. year specifics. <br>
Country vs. total of Europe. <br>
Disease vs. NSP <br>
In prevalence data: all ages vs. youth <br>
Disease: cummulatively show AIDS and HIV <br>
Deaths decomposed on toxicology <br>
Treatment demand: previously vs. not previously treated <br>
Drug seizures vs. country policies on drugs

### Features, interactivity

The map of Europe is shown with, when no countries, years or drugs are selected no data is shown. Options for data selection include drug-specific topics (for cannabis, cocaine, ecstasy, amphetamines) and non-drug-specific topics. For each topic a specific comparisson between countries is provided for each year, with clear indications where data is missing. Trends can be shown for countries on themselves.

Interactivity is provided by a selectable topic and optionally a subtopic (f.e. AIDS vs. HIV for disease), a time slide (2007 - 2014) and selectable countries.

### Limitations and troubleshooting

- The amount of available data differs strongly over the years and in between countries. In order for patterns to emerge clearly still, a clever way of visualisation has to be found.
- The way data has been obtained for each and every country differs. The provided data hopefully shows interesting trends supported by their reasonable comparability.
- Units of measurement for different forms of drugs need to be incorporated without distracting from the message
- Treatmant demand in relation to population size/amount of frequent users?
- The non-drug specific data (death and disease, health and social responses) should be incorporated with some relation to the drug specific data, in order to confer a specific message.

### MVP

The visualisation needs to clearly set out development over the years and comparisons between countries. The initial focus lies on the drug specific data (prevalence, treatment demand, seizures and purity/potency for cannabis, cocaine, amphatemines and ecstacy).

Figures should adjust to clicked topid and year on slide.

### Sketching

Data selection (more detailed and up-to-date in data_analysis.xlsx)

![dataselection](/doc/dataselection.jpg)

![drugspecifics](/doc/sketch_drugspecifics.jpg)

![nondrugspecifics](/doc/sketch_nondrugspecifics.jpg)


### Data sources
- [Population data](http://ec.europa.eu/eurostat/data/database)
- [EMCDDA statistical bulletin 2016](http://www.emcdda.europa.eu/data/stats2016)
  - [Annex methods and definitions 2015](http://www.emcdda.europa.eu/data/stats2015/methods)
    - Quote: 'In particular, information on patterns of drug use, such as primary drug and injecting behaviour, complement estimates of the prevalence of problem drug use (PDU), drug-related infectious diseases (DRID) and drug-related deaths (DRD).'

### Background readings
- [CBS report on XTC, 2015](https://www.cbs.nl/nl-nl/nieuws/2015/29/kwart-miljoen-nederlanders-gebruikt-ecstasy)
- [Trimbos Instituut](https://www.drugsinfo.nl/publiek/beleid-en-cijfers/cijfers)
  - ['Nationale drug monitor' 2016)](https://www.trimbos.nl/kerncijfers/nationale-drug-monitor)

### Similar visualisations (features and implementation)
- [D3 source](d3js.org)
  - [Interactive data map](https://www.theguardian.com/environment/interactive/2013/may/14/alaska-villages-frontline-global-warming)
- [Catalogue of possible visualisations](datavizcatalogue.com)
  - [Choropleth map](http://www.datavizcatalogue.com/methods/choropleth.html)

### Former ideas
- voedingswaarde van allerhande recepten
- samenstelling voedingsmiddelen tov dagelijke aanbevolen hoeveelheid
- leesgedrag nieuwsapplicaties
- etnische samenstelling buurten grote steden icm armoedeschaal, demografische verdeling
- politieke betrokkenheid verschillende leeftijdsklassen
- woningnood in amsterdam, toerismeaantallen, samenstelling winkelaanbod, reden van verblijf inwoners (yuppenopkomst)
- geweld tegen hulpverleners
- immigratiestromen,  investering landen in nieuwkomers, aard investeringen
- vrijwilligerswerk onder bevolking
- recreationeel drugsgebruik, zuiverheid stoffen, gevaren bij gebruik
