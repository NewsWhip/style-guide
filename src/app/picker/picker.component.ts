import { Component, OnInit } from '@angular/core';
import { IPickerItem } from 'nw-style-guide/picker';

@Component({
    selector: 'app-picker',
    templateUrl: './picker.component.html',
    styleUrls: ['./picker.component.scss'],
    standalone: false
})
export class PickerComponent implements OnInit {

  public countries: IPickerItem[] = [
    {
      "id": "regionCode-na",
      "parentId": null,
      "key": "regionCode",
      "displayName": "North America",
      "value": "na",
      "added": false
    },
    {
      "id": "countryCode-us",
      "parentId": "regionCode-na",
      "key": "countryCode",
      "displayName": "United States",
      "value": "us",
      "added": false
    },
    {
      "id": "sublocation-163",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 163,
      "displayName": "Atlanta, GA",
      "added": false
    },
    {
      "id": "sublocation-140",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 140,
      "displayName": "Austin, TX",
      "added": false
    },
    {
      "id": "sublocation-164",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 164,
      "displayName": "Baltimore, MD",
      "added": false
    },
    {
      "id": "sublocation-150",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 150,
      "displayName": "Long Island, NY",
      "added": false
    },
    {
      "id": "sublocation-151",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 151,
      "displayName": "Memphis, TN",
      "added": false
    },
    {
      "id": "sublocation-172",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 172,
      "displayName": "Miami, FL",
      "added": false
    },
    {
      "id": "sublocation-660",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 660,
      "displayName": "Milwaukee, WI",
      "added": false
    },
    {
      "id": "sublocation-152",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 152,
      "displayName": "Minneapolis, MN",
      "added": false
    },
    {
      "id": "sublocation-759",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 759,
      "displayName": "Mobile, AL",
      "added": false
    },
    {
      "id": "sublocation-760",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 760,
      "displayName": "Montgomery, AL",
      "added": false
    },
    {
      "id": "sublocation-153",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 153,
      "displayName": "Nashville, TN",
      "added": false
    },
    {
      "id": "sublocation-173",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 173,
      "displayName": "New Orleans, LA",
      "added": false
    },
    {
      "id": "sublocation-762",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 762,
      "displayName": "Newark, NJ",
      "added": false
    },
    {
      "id": "sublocation-174",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 174,
      "displayName": "New York, NY",
      "added": false
    },
    {
      "id": "sublocation-141",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 141,
      "displayName": "North Carolina",
      "added": false
    },
    {
      "id": "sublocation-154",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 154,
      "displayName": "Oklahoma City, OK",
      "added": false
    },
    {
      "id": "sublocation-657",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 657,
      "displayName": "Omaha, NE",
      "added": false
    },
    {
      "id": "sublocation-175",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 175,
      "displayName": "Orlando, FL",
      "added": false
    },
    {
      "id": "sublocation-155",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 155,
      "displayName": "Philadelphia, PA",
      "added": false
    },
    {
      "id": "sublocation-176",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 176,
      "displayName": "Phoenix, AZ",
      "added": false
    },
    {
      "id": "sublocation-156",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 156,
      "displayName": "Pittsburgh, PA",
      "added": false
    },
    {
      "id": "sublocation-157",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 157,
      "displayName": "Portland, OR",
      "added": false
    },
    {
      "id": "sublocation-630",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 630,
      "displayName": "Richmond, VA",
      "added": false
    },
    {
      "id": "sublocation-177",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 177,
      "displayName": "Sacramento, CA",
      "added": false
    },
    {
      "id": "sublocation-158",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 158,
      "displayName": "Salt Lake City, UT",
      "added": false
    },
    {
      "id": "sublocation-159",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 159,
      "displayName": "San Antonio, TX",
      "added": false
    },
    {
      "id": "sublocation-178",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 178,
      "displayName": "San Diego, CA",
      "added": false
    },
    {
      "id": "sublocation-179",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 179,
      "displayName": "San Francisco, CA",
      "added": false
    },
    {
      "id": "sublocation-180",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 180,
      "displayName": "San Jose, CA",
      "added": false
    },
    {
      "id": "sublocation-160",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 160,
      "displayName": "Seattle, WA",
      "added": false
    },
    {
      "id": "sublocation-715",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 715,
      "displayName": "South Carolina",
      "added": false
    },
    {
      "id": "sublocation-161",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 161,
      "displayName": "St. Louis, MO",
      "added": false
    },
    {
      "id": "sublocation-181",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 181,
      "displayName": "Tampa, FL",
      "added": false
    },
    {
      "id": "sublocation-162",
      "parentId": "countryCode-us",
      "key": "sublocation",
      "value": 162,
      "displayName": "Washington, DC",
      "added": false
    },
    {
      "id": "countryCode-ush",
      "parentId": "regionCode-na",
      "key": "countryCode",
      "displayName": "U.S. Hispanic",
      "value": "ush",
      "added": false
    },
    {
      "id": "countryCode-ca",
      "parentId": "regionCode-na",
      "key": "countryCode",
      "displayName": "Canada",
      "value": "ca",
      "added": false
    },
    {
      "id": "sublocation-186",
      "parentId": "countryCode-ca",
      "key": "sublocation",
      "value": 186,
      "displayName": "Calgary",
      "added": false
    },
    {
      "id": "sublocation-187",
      "parentId": "countryCode-ca",
      "key": "sublocation",
      "value": 187,
      "displayName": "Edmonton",
      "added": false
    },
    {
      "id": "sublocation-183",
      "parentId": "countryCode-ca",
      "key": "sublocation",
      "value": 183,
      "displayName": "Montreal",
      "added": false
    },
    {
      "id": "sublocation-185",
      "parentId": "countryCode-ca",
      "key": "sublocation",
      "value": 185,
      "displayName": "Ottawa",
      "added": false
    },
    {
      "id": "sublocation-765",
      "parentId": "countryCode-ca",
      "key": "sublocation",
      "value": 765,
      "displayName": "Quebec",
      "added": false
    },
    {
      "id": "sublocation-182",
      "parentId": "countryCode-ca",
      "key": "sublocation",
      "value": 182,
      "displayName": "Toronto",
      "added": false
    },
    {
      "id": "sublocation-184",
      "parentId": "countryCode-ca",
      "key": "sublocation",
      "value": 184,
      "displayName": "Vancouver",
      "added": false
    },
    {
      "id": "countryCode-an",
      "parentId": "regionCode-na",
      "key": "countryCode",
      "displayName": "Netherlands Antilles",
      "value": "an",
      "added": false
    },
    {
      "id": "countryCode-mx",
      "parentId": "regionCode-na",
      "key": "countryCode",
      "displayName": "Mexico",
      "value": "mx",
      "added": false
    },
    {
      "id": "regionCode-eu",
      "parentId": null,
      "key": "regionCode",
      "displayName": "Europe",
      "value": "eu",
      "added": false
    },
    {
      "id": "countryCode-gb",
      "parentId": "regionCode-eu",
      "key": "countryCode",
      "displayName": "United Kingdom",
      "value": "gb",
      "added": false
    },
    {
      "id": "sublocation-418",
      "parentId": "countryCode-gb",
      "key": "sublocation",
      "value": 418,
      "displayName": "Birmingham",
      "added": false
    },
    {
      "id": "sublocation-428",
      "parentId": "countryCode-gb",
      "key": "sublocation",
      "value": 428,
      "displayName": "East England",
      "added": false
    },
    {
      "id": "sublocation-754",
      "parentId": "countryCode-gb",
      "key": "sublocation",
      "value": 754,
      "displayName": "Edinburgh ",
      "added": false
    },
    {
      "id": "sublocation-764",
      "parentId": "countryCode-gb",
      "key": "sublocation",
      "value": 764,
      "displayName": "Glasgow",
      "added": false
    },
    {
      "id": "sublocation-420",
      "parentId": "countryCode-gb",
      "key": "sublocation",
      "value": 420,
      "displayName": "Liverpool",
      "added": false
    },
    {
      "id": "sublocation-417",
      "parentId": "countryCode-gb",
      "key": "sublocation",
      "value": 417,
      "displayName": "London",
      "added": false
    },
    {
      "id": "sublocation-419",
      "parentId": "countryCode-gb",
      "key": "sublocation",
      "value": 419,
      "displayName": "Manchester",
      "added": false
    },
    {
      "id": "sublocation-424",
      "parentId": "countryCode-gb",
      "key": "sublocation",
      "value": 424,
      "displayName": "Midlands",
      "added": false
    },
    {
      "id": "sublocation-425",
      "parentId": "countryCode-gb",
      "key": "sublocation",
      "value": 425,
      "displayName": "North England",
      "added": false
    },
    {
      "id": "sublocation-757",
      "parentId": "countryCode-gb",
      "key": "sublocation",
      "value": 757,
      "displayName": "Northern Ireland",
      "added": false
    },
    {
      "id": "sublocation-421",
      "parentId": "countryCode-gb",
      "key": "sublocation",
      "value": 421,
      "displayName": "Scotland",
      "added": false
    },
    {
      "id": "sublocation-427",
      "parentId": "countryCode-gb",
      "key": "sublocation",
      "value": 427,
      "displayName": "South East England",
      "added": false
    },
    {
      "id": "sublocation-431",
      "parentId": "countryCode-gb",
      "key": "sublocation",
      "value": 431,
      "displayName": "South West England",
      "added": false
    },
    {
      "id": "sublocation-422",
      "parentId": "countryCode-gb",
      "key": "sublocation",
      "value": 422,
      "displayName": "Wales",
      "added": false
    },
    {
      "id": "sublocation-426",
      "parentId": "countryCode-gb",
      "key": "sublocation",
      "value": 426,
      "displayName": "Yorkshire & Humber",
      "added": false
    },
    {
      "id": "countryCode-de",
      "parentId": "regionCode-eu",
      "key": "countryCode",
      "displayName": "Germany",
      "value": "de",
      "added": false
    },
    {
      "id": "sublocation-263",
      "parentId": "countryCode-de",
      "key": "sublocation",
      "value": 263,
      "displayName": "Baden-Württemberg",
      "added": false
    },
    {
      "id": "sublocation-264",
      "parentId": "countryCode-de",
      "key": "sublocation",
      "value": 264,
      "displayName": "Bayern",
      "added": false
    },
    {
      "id": "sublocation-265",
      "parentId": "countryCode-de",
      "key": "sublocation",
      "value": 265,
      "displayName": "Berlin-Brandenburg",
      "added": false
    },
    {
      "id": "sublocation-266",
      "parentId": "countryCode-de",
      "key": "sublocation",
      "value": 266,
      "displayName": "Hamburg-Schleswig-Holstein",
      "added": false
    },
    {
      "id": "sublocation-267",
      "parentId": "countryCode-de",
      "key": "sublocation",
      "value": 267,
      "displayName": "Hessen",
      "added": false
    },
    {
      "id": "sublocation-440",
      "parentId": "countryCode-de",
      "key": "sublocation",
      "value": 440,
      "displayName": "Lower Saxony",
      "added": false
    },
    {
      "id": "sublocation-268",
      "parentId": "countryCode-de",
      "key": "sublocation",
      "value": 268,
      "displayName": "Mecklenburg-Vorpommern",
      "added": false
    },
    {
      "id": "sublocation-269",
      "parentId": "countryCode-de",
      "key": "sublocation",
      "value": 269,
      "displayName": "Niedersachsen-Bremen",
      "added": false
    },
    {
      "id": "sublocation-270",
      "parentId": "countryCode-de",
      "key": "sublocation",
      "value": 270,
      "displayName": "Nordrhein-Westfalen",
      "added": false
    },
    {
      "id": "sublocation-272",
      "parentId": "countryCode-de",
      "key": "sublocation",
      "value": 272,
      "displayName": "Rheinland-Pfalz",
      "added": false
    },
    {
      "id": "sublocation-273",
      "parentId": "countryCode-de",
      "key": "sublocation",
      "value": 273,
      "displayName": "Saarland",
      "added": false
    },
    {
      "id": "sublocation-274",
      "parentId": "countryCode-de",
      "key": "sublocation",
      "value": 274,
      "displayName": "Sachsen",
      "added": false
    },
    {
      "id": "sublocation-275",
      "parentId": "countryCode-de",
      "key": "sublocation",
      "value": 275,
      "displayName": "Sachsen-Anhalt",
      "added": false
    },
    {
      "id": "sublocation-276",
      "parentId": "countryCode-de",
      "key": "sublocation",
      "value": 276,
      "displayName": "Thüringen",
      "added": false
    },
    {
      "id": "countryCode-es",
      "parentId": "regionCode-eu",
      "key": "countryCode",
      "displayName": "Spain",
      "value": "es",
      "added": false
    },
    {
      "id": "sublocation-783",
      "parentId": "countryCode-es",
      "key": "sublocation",
      "value": 783,
      "displayName": "Andalucía",
      "added": false
    },
    {
      "id": "sublocation-784",
      "parentId": "countryCode-es",
      "key": "sublocation",
      "value": 784,
      "displayName": "Aragón",
      "added": false
    },
    {
      "id": "sublocation-785",
      "parentId": "countryCode-es",
      "key": "sublocation",
      "value": 785,
      "displayName": "Canarias",
      "added": false
    },
    {
      "id": "sublocation-786",
      "parentId": "countryCode-es",
      "key": "sublocation",
      "value": 786,
      "displayName": "Cantabria",
      "added": false
    },
    {
      "id": "sublocation-787",
      "parentId": "countryCode-es",
      "key": "sublocation",
      "value": 787,
      "displayName": "Castilla y León",
      "added": false
    },
    {
      "id": "sublocation-788",
      "parentId": "countryCode-es",
      "key": "sublocation",
      "value": 788,
      "displayName": "Castilla-La Mancha",
      "added": false
    },
    {
      "id": "sublocation-789",
      "parentId": "countryCode-es",
      "key": "sublocation",
      "value": 789,
      "displayName": "Cataluña",
      "added": false
    },
    {
      "id": "sublocation-790",
      "parentId": "countryCode-es",
      "key": "sublocation",
      "value": 790,
      "displayName": "Comunidad Foral de Navarra",
      "added": false
    },
    {
      "id": "sublocation-791",
      "parentId": "countryCode-es",
      "key": "sublocation",
      "value": 791,
      "displayName": "Comunidad Valenciana",
      "added": false
    },
    {
      "id": "sublocation-792",
      "parentId": "countryCode-es",
      "key": "sublocation",
      "value": 792,
      "displayName": "Comunidad de Madrid",
      "added": false
    },
    {
      "id": "sublocation-793",
      "parentId": "countryCode-es",
      "key": "sublocation",
      "value": 793,
      "displayName": "Extremadura",
      "added": false
    },
    {
      "id": "sublocation-794",
      "parentId": "countryCode-es",
      "key": "sublocation",
      "value": 794,
      "displayName": "Galicia",
      "added": false
    },
    {
      "id": "sublocation-795",
      "parentId": "countryCode-es",
      "key": "sublocation",
      "value": 795,
      "displayName": "Islas Baleares",
      "added": false
    },
    {
      "id": "sublocation-796",
      "parentId": "countryCode-es",
      "key": "sublocation",
      "value": 796,
      "displayName": "La Rioja",
      "added": false
    },
    {
      "id": "sublocation-797",
      "parentId": "countryCode-es",
      "key": "sublocation",
      "value": 797,
      "displayName": "País Vasco",
      "added": false
    },
    {
      "id": "sublocation-798",
      "parentId": "countryCode-es",
      "key": "sublocation",
      "value": 798,
      "displayName": "Principado de Asturias",
      "added": false
    },
    {
      "id": "sublocation-799",
      "parentId": "countryCode-es",
      "key": "sublocation",
      "value": 799,
      "displayName": "Región de Murcia",
      "added": false
    },
    {
      "id": "countryCode-fr",
      "parentId": "regionCode-eu",
      "key": "countryCode",
      "displayName": "France",
      "value": "fr",
      "added": false
    },
    {
      "id": "sublocation-768",
      "parentId": "countryCode-fr",
      "key": "sublocation",
      "value": 768,
      "displayName": "Auvergne-Rhône-Alpes",
      "added": false
    },
    {
      "id": "sublocation-769",
      "parentId": "countryCode-fr",
      "key": "sublocation",
      "value": 769,
      "displayName": "Bourgogne-Franche-Comté",
      "added": false
    },
    {
      "id": "sublocation-770",
      "parentId": "countryCode-fr",
      "key": "sublocation",
      "value": 770,
      "displayName": "Bretagne",
      "added": false
    },
    {
      "id": "sublocation-771",
      "parentId": "countryCode-fr",
      "key": "sublocation",
      "value": 771,
      "displayName": "Centre-Val de Loire",
      "added": false
    },
    {
      "id": "sublocation-772",
      "parentId": "countryCode-fr",
      "key": "sublocation",
      "value": 772,
      "displayName": "Corse",
      "added": false
    },
    {
      "id": "sublocation-766",
      "parentId": "countryCode-fr",
      "key": "sublocation",
      "value": 766,
      "displayName": "Grand Est",
      "added": false
    },
    {
      "id": "sublocation-774",
      "parentId": "countryCode-fr",
      "key": "sublocation",
      "value": 774,
      "displayName": "Hauts-de-France",
      "added": false
    },
    {
      "id": "sublocation-861",
      "parentId": "countryCode-fr",
      "key": "sublocation",
      "value": 861,
      "displayName": "Île-de-France",
      "added": false
    },
    {
      "id": "sublocation-775",
      "parentId": "countryCode-fr",
      "key": "sublocation",
      "value": 775,
      "displayName": "Normandie",
      "added": false
    },
    {
      "id": "sublocation-767",
      "parentId": "countryCode-fr",
      "key": "sublocation",
      "value": 767,
      "displayName": "Nouvelle-Aquitaine",
      "added": false
    },
    {
      "id": "sublocation-773",
      "parentId": "countryCode-fr",
      "key": "sublocation",
      "value": 773,
      "displayName": "Occitanie",
      "added": false
    },
    {
      "id": "sublocation-776",
      "parentId": "countryCode-fr",
      "key": "sublocation",
      "value": 776,
      "displayName": "Pays de la Loire",
      "added": false
    },
    {
      "id": "sublocation-777",
      "parentId": "countryCode-fr",
      "key": "sublocation",
      "value": 777,
      "displayName": "Provence-Alpes-Côte d'Azur",
      "added": false
    },
    {
      "id": "sublocation-778",
      "parentId": "countryCode-fr",
      "key": "sublocation",
      "value": 778,
      "displayName": "Guadeloupe",
      "added": false
    },
    {
      "id": "sublocation-779",
      "parentId": "countryCode-fr",
      "key": "sublocation",
      "value": 779,
      "displayName": "Guyane",
      "added": false
    },
    {
      "id": "sublocation-780",
      "parentId": "countryCode-fr",
      "key": "sublocation",
      "value": 780,
      "displayName": "La Réunion",
      "added": false
    },
    {
      "id": "sublocation-781",
      "parentId": "countryCode-fr",
      "key": "sublocation",
      "value": 781,
      "displayName": "Martinique",
      "added": false
    },
    {
      "id": "sublocation-782",
      "parentId": "countryCode-fr",
      "key": "sublocation",
      "value": 782,
      "displayName": "Mayotte",
      "added": false
    },
    {
      "id": "countryCode-se",
      "parentId": "regionCode-eu",
      "key": "countryCode",
      "displayName": "Sweden",
      "value": "se",
      "added": false
    },
    {
      "id": "sublocation-807",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 807,
      "displayName": "Ångermanland",
      "added": false
    },
    {
      "id": "sublocation-808",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 808,
      "displayName": "Blekinge",
      "added": false
    },
    {
      "id": "sublocation-809",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 809,
      "displayName": "Bohuslän",
      "added": false
    },
    {
      "id": "sublocation-810",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 810,
      "displayName": "Dalarna",
      "added": false
    },
    {
      "id": "sublocation-811",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 811,
      "displayName": "Dalsland",
      "added": false
    },
    {
      "id": "sublocation-812",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 812,
      "displayName": "Gotland",
      "added": false
    },
    {
      "id": "sublocation-813",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 813,
      "displayName": "Gästrikland",
      "added": false
    },
    {
      "id": "sublocation-814",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 814,
      "displayName": "Halland",
      "added": false
    },
    {
      "id": "sublocation-815",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 815,
      "displayName": "Hälsingland",
      "added": false
    },
    {
      "id": "sublocation-816",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 816,
      "displayName": "Härjedalen",
      "added": false
    },
    {
      "id": "sublocation-817",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 817,
      "displayName": "Jämtland",
      "added": false
    },
    {
      "id": "sublocation-818",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 818,
      "displayName": "Lappland",
      "added": false
    },
    {
      "id": "sublocation-819",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 819,
      "displayName": "Medelpad",
      "added": false
    },
    {
      "id": "sublocation-820",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 820,
      "displayName": "Norrbotten",
      "added": false
    },
    {
      "id": "sublocation-821",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 821,
      "displayName": "Närke",
      "added": false
    },
    {
      "id": "sublocation-822",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 822,
      "displayName": "Öland",
      "added": false
    },
    {
      "id": "sublocation-823",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 823,
      "displayName": "Östergötland",
      "added": false
    },
    {
      "id": "sublocation-824",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 824,
      "displayName": "Skåne",
      "added": false
    },
    {
      "id": "sublocation-825",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 825,
      "displayName": "Småland",
      "added": false
    },
    {
      "id": "sublocation-826",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 826,
      "displayName": "Södermanland",
      "added": false
    },
    {
      "id": "sublocation-827",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 827,
      "displayName": "Uppland",
      "added": false
    },
    {
      "id": "sublocation-828",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 828,
      "displayName": "Värmland",
      "added": false
    },
    {
      "id": "sublocation-829",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 829,
      "displayName": "Västmanland",
      "added": false
    },
    {
      "id": "sublocation-830",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 830,
      "displayName": "Västerbotten",
      "added": false
    },
    {
      "id": "sublocation-831",
      "parentId": "countryCode-se",
      "key": "sublocation",
      "value": 831,
      "displayName": "Västergötland",
      "added": false
    },
    {
      "id": "countryCode-ad",
      "parentId": "regionCode-eu",
      "key": "countryCode",
      "displayName": "Andorra",
      "value": "ad",
      "added": false
    },
    {
      "id": "countryCode-ax",
      "parentId": "regionCode-eu",
      "key": "countryCode",
      "displayName": "Åland Islands",
      "value": "ax",
      "added": false
    },
    {
      "id": "countryCode-ie",
      "parentId": "regionCode-eu",
      "key": "countryCode",
      "displayName": "Ireland",
      "value": "ie",
      "added": false
    },
    {
      "id": "countryCode-it",
      "parentId": "regionCode-eu",
      "key": "countryCode",
      "displayName": "Italy",
      "value": "it",
      "added": false
    },
    {
      "id": "countryCode-md",
      "parentId": "regionCode-eu",
      "key": "countryCode",
      "displayName": "Moldova",
      "value": "md",
      "added": false
    },
    {
      "id": "countryCode-pt",
      "parentId": "regionCode-eu",
      "key": "countryCode",
      "displayName": "Portugal",
      "value": "pt",
      "added": false
    },
    {
      "id": "countryCode-ro",
      "parentId": "regionCode-eu",
      "key": "countryCode",
      "displayName": "Romania",
      "value": "ro",
      "added": false
    },
    {
      "id": "countryCode-tr",
      "parentId": "regionCode-eu",
      "key": "countryCode",
      "displayName": "Turkey",
      "value": "tr",
      "added": false
    },
    {
      "id": "regionCode-oc",
      "parentId": null,
      "key": "regionCode",
      "displayName": "Oceania",
      "value": "oc",
      "added": false
    },
    {
      "id": "countryCode-au",
      "parentId": "regionCode-oc",
      "key": "countryCode",
      "displayName": "Australia",
      "value": "au",
      "added": false
    },
    {
      "id": "sublocation-800",
      "parentId": "countryCode-au",
      "key": "sublocation",
      "value": 800,
      "displayName": "New South Wales",
      "added": false
    },
    {
      "id": "sublocation-801",
      "parentId": "countryCode-au",
      "key": "sublocation",
      "value": 801,
      "displayName": "Northern Territory",
      "added": false
    },
    {
      "id": "sublocation-802",
      "parentId": "countryCode-au",
      "key": "sublocation",
      "value": 802,
      "displayName": "Queensland",
      "added": false
    },
    {
      "id": "sublocation-803",
      "parentId": "countryCode-au",
      "key": "sublocation",
      "value": 803,
      "displayName": "South Australia",
      "added": false
    },
    {
      "id": "sublocation-804",
      "parentId": "countryCode-au",
      "key": "sublocation",
      "value": 804,
      "displayName": "Tasmania",
      "added": false
    },
    {
      "id": "sublocation-805",
      "parentId": "countryCode-au",
      "key": "sublocation",
      "value": 805,
      "displayName": "Victoria",
      "added": false
    },
    {
      "id": "sublocation-806",
      "parentId": "countryCode-au",
      "key": "sublocation",
      "value": 806,
      "displayName": "Western Australia",
      "added": false
    },
    {
      "id": "regionCode-sa",
      "parentId": null,
      "key": "regionCode",
      "displayName": "South America",
      "value": "sa",
      "added": false
    },
    {
      "id": "countryCode-ar",
      "parentId": "regionCode-sa",
      "key": "countryCode",
      "displayName": "Argentina",
      "value": "ar",
      "added": false
    },
    {
      "id": "countryCode-br",
      "parentId": "regionCode-sa",
      "key": "countryCode",
      "displayName": "Brazil",
      "value": "br",
      "added": false
    },
    {
      "id": "countryCode-pe",
      "parentId": "regionCode-sa",
      "key": "countryCode",
      "displayName": "Peru",
      "value": "pe",
      "added": false
    },
    {
      "id": "regionCode-as",
      "parentId": null,
      "key": "regionCode",
      "displayName": "Asia",
      "value": "as",
      "added": false
    },
    {
      "id": "countryCode-cn",
      "parentId": "regionCode-as",
      "key": "countryCode",
      "displayName": "China",
      "value": "cn",
      "added": false
    },
    {
      "id": "sublocation-710",
      "parentId": "countryCode-cn",
      "key": "sublocation",
      "value": 710,
      "displayName": "Mainland",
      "added": false
    },
    {
      "id": "sublocation-711",
      "parentId": "countryCode-cn",
      "key": "sublocation",
      "value": 711,
      "displayName": "Overseas",
      "added": false
    },
    {
      "id": "sublocation-712",
      "parentId": "countryCode-cn",
      "key": "sublocation",
      "value": 712,
      "displayName": "Honkong&Macau",
      "added": false
    },
    {
      "id": "sublocation-713",
      "parentId": "countryCode-cn",
      "key": "sublocation",
      "value": 713,
      "displayName": "Taiwan",
      "added": false
    },
    {
      "id": "countryCode-ae",
      "parentId": "regionCode-as",
      "key": "countryCode",
      "displayName": "United Arab Emirates",
      "value": "ae",
      "added": false
    },
    {
      "id": "countryCode-in",
      "parentId": "regionCode-as",
      "key": "countryCode",
      "displayName": "India",
      "value": "in",
      "added": false
    },
    {
      "id": "countryCode-kz",
      "parentId": "regionCode-as",
      "key": "countryCode",
      "displayName": "Kazakhstan",
      "value": "kz",
      "added": false
    },
    {
      "id": "regionCode-me",
      "parentId": null,
      "key": "regionCode",
      "displayName": "Middle East",
      "value": "me",
      "added": false
    },
    {
      "id": "countryCode-tr",
      "parentId": "regionCode-me",
      "key": "countryCode",
      "displayName": "Turkey",
      "value": "tr",
      "added": false
    },
    {
      "id": "countryCode-ae",
      "parentId": "regionCode-me",
      "key": "countryCode",
      "displayName": "United Arab Emirates",
      "value": "ae",
      "added": false
    },
    {
      "id": "regionCode-af",
      "parentId": null,
      "key": "regionCode",
      "displayName": "Africa",
      "value": "af",
      "added": false
    },
    {
      "id": "countryCode-za",
      "parentId": "regionCode-af",
      "key": "countryCode",
      "displayName": "South Africa",
      "value": "za",
      "added": false
    }
  ]

  constructor() { }

  ngOnInit() {
      console.log(this.countries)
  }

  getPlaceholder(): string {
    const selections = this.countries
        .filter(c => c.added || c.excluded);

    const placeholder = selections
        .slice(0, 3)
        .map(c => {
            return c.added ?
                c.displayName :
                `<span class="excluded">${c.displayName}</span>`
        })
        .join(', ');

    const moreItems: string = selections.length > 3 ?
        `<span class="more-items">&nbsp;+ ${selections.length - 3} more</span>` :
        `<span>`;

    return `
        <span class="custom-placeholder">
            <span class="selections text-ellipsis">${placeholder}</span>
            ${moreItems}
        </span>
    `;
  }

}
