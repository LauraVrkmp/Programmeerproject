Data source: [Stats EMCDDA](http://www.emcdda.europa.eu/data/stats2016)

### Data structure
- Prevalance
  - cannabis / cocaine / amphetamines / ecstasy
    - lifetime / last year / last month
      - all / young
        - country
          - year
            - total percentage
- Treatment demand
  - cannabis / cocaine / amphetamines / ecstasy (MDMA)
    - country
      - year
        - clients n
- Seizures of drugs
  - herbal cannabis / cocaine / amphetamine / ecstasy
    - country
      - year
        - total seizures n
- Purity and potency
  - cocaine / amphetamines
    - country
      - year
        - percentage
  - herbal cannabis
    - country
      - year
        - mean THC percentage
  - ecstasy
    - country
      - year
        - mean milligrams
- Overdose deaths
  - with opiates / without opiates / unknown
    - country
      - year
        - total n
        - mean age
- Infectious diseases
  - HIV / AIDS
    - country
      - year
        - total notifications n
- health and social responses
  - OST / NSP
    - country
      - year
        - clients n
        
 ### Visualisation design
 
 Maps of Europe
  - with no drug selected
    - time slide
      - overdose deaths
        - total overdose deaths: n, mean age: n
      - infectious disease notifications
        - HIV: n, AIDS: n
      - health and social responses
        - OST clients: n, NSP clients: n
    - topics clickable for trend (with opiates, without, unknown specified)
      - current year in different color in bar chart
    - amount clickable for comparisson to other countries (with opiates, without, unknown specified)
      - current country in different color in bar chart
  - with drug selected
    - time slide
      - prevalence
        - bar chart with lifetime, overlap year, overlap month for all and young
          - total percentage
      - treatment demand
        - clients n
      - seizures of drugs
        - total seizures n
      - purity / potency
        - for cocaine and amphetamines: purity: %
        - for mdma: potency: mg
        - for herbal cannabis: % THC
    - topics clickable for trend (prevalence: select lifetime, year or month, both all and young)
      - current year in different color in bar chart
    - amount clickable for comparisson to other countries (prevalence: select lifetime, year or month, both all and young)
      - current country in different color in bar chart