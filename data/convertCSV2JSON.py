# Data conversion: .csv to .json
# Programming project by Laura Veerkamp

import math
import json
import pandas as pd
import decimal

jsonfile = open('data.json', 'w')

years = ('2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007')
countries = ('AUT', 'BEL', 'BGR', 'HRV', 'CYP', 'CZE', 'DNK', 'EST', 'FIN', 'FRA', 'DEU', 'GRC', 'HUN', 'IRL', 'ITA', 'LVA', 'LTU', 'LUX', 'MLT', 'NLD', 'NOR', 'POL', 'PRT', 'ROU', 'SVK', 'SVN', 'ESP', 'SWE', 'TUR', 'GBR')
age = ('all', 'young')
recency = ('ever', 'year', 'month')
drugs = ('cannabis', 'cocaine', 'amphetamines', 'ecstasy')
deaths_topic = ('total', 'mean_age')
disease = ('HIV', 'AIDS')
response = ('OST', 'NSP')
topic = ('prevalence', 'deaths', 'disease', 'treatment', 'seizures', 'purity', 'HSR', 'population')

reader = pd.read_csv('data.csv', names = countries)
points_dict = {}
count = 0

for x_index, x_val in enumerate(topic):
    points_dict[x_val] = {}
    if x_index == 0 or x_index == 3 or x_index == 4 or x_index == 5:
        for y_val in drugs:
            points_dict[x_val][y_val] = {}
            if x_index == 0:
                for z_val in recency:
                    points_dict[x_val][y_val][z_val] = {}
                    for u_val in age:
                        points_dict[x_val][y_val][z_val][u_val] = {}
                        for v_val in countries:
                            points_dict[x_val][y_val][z_val][u_val][v_val] = {}
                            for w_index, w_val in enumerate(years):
                                points_dict[x_val][y_val][z_val][u_val][v_val][w_val] = round(float(reader[v_val][w_index+count]), 1)
                        count += len(years)
            if x_index == 3 or x_index == 4 or x_index == 5:
                for z_val in countries:
                    points_dict[x_val][y_val][z_val] = {}
                    for u_index, u_val in enumerate(years):
                        string = str(reader[z_val][u_index+count])
                        d = decimal.Decimal(string)
                        n = -1 * d.as_tuple().exponent
                        if math.isnan(float(reader[z_val][u_index+count])):
                            points_dict[x_val][y_val][z_val][u_val] = reader[z_val][u_index+count]
                        elif x_index == 5:
                            points_dict[x_val][y_val][z_val][u_val] = round(float(reader[z_val][u_index+count]), n)
                        else:
                            points_dict[x_val][y_val][z_val][u_val] = int(reader[z_val][u_index+count])
                count += len(years)
    if x_index == 1 or x_index == 2 or x_index == 6:
        if x_index == 1:
            index_topic = deaths_topic
        if x_index == 2:
            index_topic = disease
        if x_index == 6:
            index_topic = response
        for y_val in index_topic:
            points_dict[x_val][y_val] = {}
            for z_val in countries:
                points_dict[x_val][y_val][z_val] = {}
                for u_index, u_val in enumerate(years):
                    if math.isnan(float(reader[z_val][u_index+count])):
                        points_dict[x_val][y_val][z_val][u_val] = reader[z_val][u_index+count]
                    elif x_index == 1 and y_val == 'mean_age':
                        points_dict[x_val][y_val][z_val][u_val] = round(float(reader[z_val][u_index+count]), 1)
                    else:
                        points_dict[x_val][y_val][z_val][u_val] = int(reader[z_val][u_index+count])
            count += len(years)
    if x_index == 7:
        for y_val in countries:
            points_dict[x_val][y_val] = {}
            for z_index, z_val in enumerate(years):
                points_dict[x_val][y_val][z_val] = int(reader[y_val][z_index+count])
        count += len(years)

json.dump(points_dict, jsonfile, sort_keys = True, indent = 4)