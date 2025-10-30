"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import * as React from "react"
import { Plus, Trash2, CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { createTourismRecord, updateTourismRecord } from "@/lib/api/tourism"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DateTimePicker } from "@/components/ui/date-time-picker"

interface Boat {
    id: number
    boat_name: string
    operator_name: string
    captain_name: string
}

interface Operator {
    name: string
}

interface Captain {
    name: string
}

// Countries and their major cities
const countriesWithCities: Record<string, string[]> = {
    // Asia
    "Philippines": ["Manila", "Quezon City", "Davao City", "Cebu City", "Zamboanga City", "Cagayan de Oro", "Iloilo City", "Bacolod", "General Santos", "Baguio", "Pasig", "Makati", "Taguig", "Caloocan", "Las Piñas"],
    "China": ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu", "Chongqing", "Tianjin", "Wuhan", "Xi'an", "Hangzhou", "Nanjing", "Suzhou", "Dongguan", "Shenyang", "Qingdao"],
    "Japan": ["Tokyo", "Osaka", "Yokohama", "Nagoya", "Sapporo", "Fukuoka", "Kobe", "Kyoto", "Kawasaki", "Saitama", "Hiroshima", "Sendai", "Chiba", "Kitakyushu", "Sakai"],
    "South Korea": ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Suwon", "Ulsan", "Changwon", "Goyang", "Yongin", "Seongnam", "Cheongju", "Bucheon", "Ansan"],
    "India": ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Bhopal"],
    "Indonesia": ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar", "Palembang", "Tangerang", "Depok", "Bekasi", "Bogor", "Pekanbaru", "Bandar Lampung", "Malang", "Yogyakarta"],
    "Thailand": ["Bangkok", "Chiang Mai", "Phuket", "Pattaya", "Nakhon Ratchasima", "Hat Yai", "Udon Thani", "Khon Kaen", "Nakhon Si Thammarat", "Surat Thani", "Chiang Rai", "Nonthaburi", "Rayong", "Samut Prakan", "Krabi"],
    "Vietnam": ["Ho Chi Minh City", "Hanoi", "Da Nang", "Hai Phong", "Can Tho", "Bien Hoa", "Hue", "Nha Trang", "Buon Ma Thuot", "Vung Tau", "Quy Nhon", "Nam Dinh", "Thai Nguyen", "Phan Thiet", "Long Xuyen"],
    "Malaysia": ["Kuala Lumpur", "George Town", "Johor Bahru", "Ipoh", "Shah Alam", "Petaling Jaya", "Malacca City", "Kuching", "Kota Kinabalu", "Seremban", "Subang Jaya", "Klang", "Miri", "Sandakan", "Alor Setar"],
    "Singapore": ["Singapore", "Jurong West", "Woodlands", "Tampines", "Bedok", "Hougang", "Choa Chu Kang", "Yishun", "Sengkang", "Punggol"],
    "Taiwan": ["Taipei", "Kaohsiung", "Taichung", "Tainan", "Hsinchu", "Chiayi", "Changhua", "Taoyuan", "Zhongli", "Keelung", "Hualien", "Pingtung", "Yunlin", "Miaoli", "Nantou"],
    "Hong Kong": ["Hong Kong", "Kowloon", "Tsuen Wan", "Sha Tin", "Tuen Mun", "Yuen Long", "Tai Po", "Sai Kung", "Central", "Causeway Bay"],
    "Myanmar": ["Yangon", "Mandalay", "Naypyidaw", "Mawlamyine", "Bago", "Pathein", "Monywa", "Sittwe", "Meiktila", "Taunggyi"],
    "Cambodia": ["Phnom Penh", "Siem Reap", "Battambang", "Sihanoukville", "Kampong Cham", "Kampong Speu", "Prey Veng", "Ta Khmau", "Pursat", "Kampot"],
    "Laos": ["Vientiane", "Luang Prabang", "Pakse", "Savannakhet", "Thakhek", "Xam Neua", "Phonsavan", "Luang Namtha", "Xaignabouli", "Salavan"],
    "Bangladesh": ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet", "Rangpur", "Barisal", "Comilla", "Gazipur", "Mymensingh"],
    "Pakistan": ["Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Hyderabad", "Peshawar", "Quetta", "Islamabad"],
    "Sri Lanka": ["Colombo", "Dehiwala-Mount Lavinia", "Moratuwa", "Jaffna", "Negombo", "Kandy", "Kalmunai", "Trincomalee", "Galle", "Batticaloa"],
    "Nepal": ["Kathmandu", "Pokhara", "Lalitpur", "Bharatpur", "Biratnagar", "Birgunj", "Dharan", "Butwal", "Hetauda", "Janakpur"],
    "Afghanistan": ["Kabul", "Herat", "Kandahar", "Mazar-i-Sharif", "Jalalabad", "Kunduz", "Ghazni", "Balkh", "Lashkar Gah", "Taloqan"],
    "Uzbekistan": ["Tashkent", "Samarkand", "Bukhara", "Namangan", "Andijan", "Nukus", "Fergana", "Qarshi", "Kokand", "Margilan"],
    "Kazakhstan": ["Almaty", "Nur-Sultan", "Shymkent", "Karaganda", "Aktobe", "Taraz", "Pavlodar", "Ust-Kamenogorsk", "Semey", "Atyrau"],
    "Mongolia": ["Ulaanbaatar", "Erdenet", "Darkhan", "Choibalsan", "Ölgii", "Mörön", "Khovd", "Bayankhongor", "Ulaangom", "Sükhbaatar"],
    "Brunei": ["Bandar Seri Begawan", "Kuala Belait", "Seria", "Tutong", "Bangar", "Muara", "Jerudong", "Lumapas", "Berakas", "Gadong"],
    "Maldives": ["Malé", "Addu City", "Fuvahmulah", "Kulhudhuffushi", "Thinadhoo", "Hithadhoo", "Hulhumalé", "Mahibadhoo", "Eydhafushi", "Naifaru"],
    
    // Middle East
    "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar", "Tabuk", "Buraidah", "Khamis Mushait", "Hofuf", "Taif", "Najran", "Hail", "Abha", "Yanbu"],
    "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain", "Khor Fakkan", "Dibba Al-Fujairah"],
    "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Adana", "Gaziantep", "Konya", "Mersin", "Kayseri", "Eskişehir", "Diyarbakır", "Samsun", "Denizli", "Malatya"],
    "Iran": ["Tehran", "Mashhad", "Isfahan", "Karaj", "Shiraz", "Tabriz", "Qom", "Ahvaz", "Kermanshah", "Urmia", "Rasht", "Zahedan", "Hamadan", "Kerman", "Yazd"],
    "Iraq": ["Baghdad", "Basra", "Mosul", "Erbil", "Najaf", "Karbala", "Sulaymaniyah", "Kirkuk", "Nasiriyah", "Ramadi"],
    "Israel": ["Jerusalem", "Tel Aviv", "Haifa", "Rishon LeZion", "Petah Tikva", "Ashdod", "Netanya", "Beersheba", "Holon", "Bnei Brak"],
    "Jordan": ["Amman", "Zarqa", "Irbid", "Russeifa", "Aqaba", "Madaba", "Salt", "Mafraq", "Jerash", "Karak"],
    "Lebanon": ["Beirut", "Tripoli", "Sidon", "Tyre", "Nabatieh", "Jounieh", "Zahle", "Baalbek", "Byblos", "Aley"],
    "Syria": ["Damascus", "Aleppo", "Homs", "Latakia", "Hama", "Deir ez-Zor", "Raqqa", "Daraa", "Tartus", "Qamishli"],
    "Yemen": ["Sana'a", "Aden", "Taiz", "Al Hudaydah", "Ibb", "Dhamar", "Al Mukalla", "Zinjibar", "Saada", "Marib"],
    "Oman": ["Muscat", "Salalah", "Sohar", "Nizwa", "Sur", "Barka", "Ibri", "Khasab", "Rustaq", "Bahla"],
    "Kuwait": ["Kuwait City", "Hawalli", "Salmiya", "Sabah Al-Salem", "Farwaniya", "Fahaheel", "Jahra", "Ahmadi", "Mangaf", "Jleeb Al-Shuyoukh"],
    "Qatar": ["Doha", "Al Rayyan", "Umm Salal Muhammad", "Al Wakrah", "Al Khor", "Mesaieed", "Dukhan", "Al Shamal", "Al Shahaniya", "Madinat ash Shamal"],
    "Bahrain": ["Manama", "Riffa", "Muharraq", "Hamad Town", "A'ali", "Isa Town", "Sitra", "Budaiya", "Jidhafs", "Al-Malikiyah"],
    "Cyprus": ["Nicosia", "Limassol", "Larnaca", "Paphos", "Famagusta", "Kyrenia", "Protaras", "Paralimni", "Morphou", "Polis"],
    "Armenia": ["Yerevan", "Gyumri", "Vanadzor", "Vagharshapat", "Hrazdan", "Abovyan", "Kapan", "Armavir", "Artashat", "Goris"],
    "Azerbaijan": ["Baku", "Ganja", "Sumqayit", "Mingachevir", "Lankaran", "Nakhchivan", "Shirvan", "Shaki", "Yevlakh", "Khankendi"],
    "Georgia": ["Tbilisi", "Batumi", "Kutaisi", "Rustavi", "Zugdidi", "Gori", "Poti", "Sukhumi", "Kobuleti", "Khashuri"],
    
    // Europe
    "United Kingdom": ["London", "Birmingham", "Manchester", "Leeds", "Glasgow", "Liverpool", "Newcastle", "Sheffield", "Bristol", "Edinburgh", "Leicester", "Nottingham", "Cardiff", "Belfast", "Southampton"],
    "Germany": ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf", "Dortmund", "Essen", "Leipzig", "Bremen", "Dresden", "Hannover", "Nuremberg", "Duisburg"],
    "France": ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille", "Rennes", "Reims", "Le Havre", "Saint-Étienne", "Toulon"],
    "Italy": ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence", "Bari", "Catania", "Venice", "Verona", "Messina", "Padua", "Trieste"],
    "Spain": ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Murcia", "Palma", "Las Palmas", "Bilbao", "Alicante", "Córdoba", "Valladolid", "Vigo", "Gijón"],
    "Poland": ["Warsaw", "Kraków", "Łódź", "Wrocław", "Poznań", "Gdańsk", "Szczecin", "Bydgoszcz", "Lublin", "Katowice", "Białystok", "Gdynia", "Częstochowa", "Radom", "Sosnowiec"],
    "Netherlands": ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Groningen", "Tilburg", "Almere", "Breda", "Nijmegen", "Apeldoorn", "Haarlem", "Arnhem", "Zaanstad", "Amersfoort"],
    "Belgium": ["Brussels", "Antwerp", "Ghent", "Charleroi", "Liège", "Bruges", "Namur", "Leuven", "Mons", "Mechelen", "Aalst", "La Louvière", "Kortrijk", "Hasselt", "Ostend"],
    "Greece": ["Athens", "Thessaloniki", "Patras", "Heraklion", "Larissa", "Volos", "Rhodes", "Ioannina", "Chania", "Chalcis", "Agrinio", "Katerini", "Kalamata", "Kavala", "Serres"],
    "Portugal": ["Lisbon", "Porto", "Amadora", "Braga", "Setúbal", "Coimbra", "Queluz", "Funchal", "Cacém", "Vila Nova de Gaia", "Loures", "Évora", "Rio de Mouro", "Odivelas", "Aveiro"],
    "Czech Republic": ["Prague", "Brno", "Ostrava", "Plzeň", "Liberec", "Olomouc", "České Budějovice", "Hradec Králové", "Ústí nad Labem", "Pardubice", "Zlín", "Havířov", "Kladno", "Most", "Opava"],
    "Romania": ["Bucharest", "Cluj-Napoca", "Timișoara", "Iași", "Constanța", "Craiova", "Brașov", "Galați", "Ploiești", "Oradea", "Brăila", "Arad", "Pitești", "Sibiu", "Bacău"],
    "Hungary": ["Budapest", "Debrecen", "Szeged", "Miskolc", "Pécs", "Győr", "Nyíregyháza", "Kecskemét", "Székesfehérvár", "Szombathely", "Érd", "Tatabánya", "Kaposvár", "Veszprém", "Sopron"],
    "Austria": ["Vienna", "Graz", "Linz", "Salzburg", "Innsbruck", "Klagenfurt", "Villach", "Wels", "Sankt Pölten", "Dornbirn", "Steyr", "Wiener Neustadt", "Feldkirch", "Bregenz", "Leonding"],
    "Switzerland": ["Zurich", "Geneva", "Basel", "Lausanne", "Bern", "Winterthur", "Lucerne", "St. Gallen", "Lugano", "Biel", "Thun", "Köniz", "La Chaux-de-Fonds", "Schaffhausen", "Fribourg"],
    "Sweden": ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköping", "Helsingborg", "Jönköping", "Norrköping", "Lund", "Umeå", "Gävle", "Borås", "Eskilstuna"],
    "Norway": ["Oslo", "Bergen", "Trondheim", "Stavanger", "Drammen", "Fredrikstad", "Kristiansand", "Sandnes", "Tromsø", "Sarpsborg", "Skien", "Ålesund", "Sandefjord", "Haugesund", "Tønsberg"],
    "Denmark": ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Randers", "Kolding", "Horsens", "Vejle", "Roskilde", "Herning", "Hørsholm", "Helsingør", "Silkeborg", "Næstved"],
    "Finland": ["Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu", "Turku", "Jyväskylä", "Lahti", "Kuopio", "Pori", "Joensuu", "Lappeenranta", "Hämeenlinna", "Vaasa", "Seinäjoki"],
    "Ireland": ["Dublin", "Cork", "Limerick", "Galway", "Waterford", "Drogheda", "Dundalk", "Swords", "Bray", "Navan", "Ennis", "Kilkenny", "Tralee", "Carlow", "Newbridge"],
    "Ukraine": ["Kyiv", "Kharkiv", "Odesa", "Dnipro", "Donetsk", "Zaporizhzhia", "Lviv", "Kryvyi Rih", "Mykolaiv", "Mariupol", "Luhansk", "Vinnytsia", "Makiivka", "Sevastopol", "Simferopol"],
    "Russia": ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg", "Kazan", "Nizhny Novgorod", "Chelyabinsk", "Samara", "Omsk", "Rostov-on-Don", "Ufa", "Krasnoyarsk", "Voronezh", "Perm", "Volgograd"],
    "Belarus": ["Minsk", "Gomel", "Mogilev", "Vitebsk", "Grodno", "Brest", "Babruysk", "Baranovichi", "Borisov", "Pinsk"],
    "Bulgaria": ["Sofia", "Plovdiv", "Varna", "Burgas", "Ruse", "Stara Zagora", "Pleven", "Sliven", "Dobrich", "Shumen"],
    "Serbia": ["Belgrade", "Novi Sad", "Niš", "Kragujevac", "Subotica", "Zrenjanin", "Pančevo", "Čačak", "Novi Pazar", "Kraljevo"],
    "Croatia": ["Zagreb", "Split", "Rijeka", "Osijek", "Zadar", "Slavonski Brod", "Pula", "Sesvete", "Karlovac", "Varaždin"],
    "Slovakia": ["Bratislava", "Košice", "Prešov", "Žilina", "Nitra", "Banská Bystrica", "Trnava", "Martin", "Trenčín", "Poprad"],
    "Slovenia": ["Ljubljana", "Maribor", "Celje", "Kranj", "Velenje", "Koper", "Novo Mesto", "Ptuj", "Trbovlje", "Kamnik"],
    "Lithuania": ["Vilnius", "Kaunas", "Klaipėda", "Šiauliai", "Panevėžys", "Alytus", "Marijampolė", "Mažeikiai", "Jonava", "Utena"],
    "Latvia": ["Riga", "Daugavpils", "Liepāja", "Jelgava", "Jūrmala", "Ventspils", "Rēzekne", "Ogre", "Valmiera", "Jēkabpils"],
    "Estonia": ["Tallinn", "Tartu", "Narva", "Pärnu", "Kohtla-Järve", "Viljandi", "Rakvere", "Maardu", "Kuressaare", "Sillamäe"],
    "Iceland": ["Reykjavík", "Kópavogur", "Hafnarfjörður", "Akureyri", "Garðabær", "Mosfellsbær", "Árborg", "Akranes", "Fjarðabyggð", "Reykjanesbær"],
    "Luxembourg": ["Luxembourg City", "Esch-sur-Alzette", "Differdange", "Dudelange", "Ettelbruck", "Diekirch", "Wiltz", "Echternach", "Rumelange", "Grevenmacher"],
    "Malta": ["Valletta", "Birkirkara", "Mosta", "Qormi", "Żabbar", "San Pawl il-Baħar", "Fgura", "Żejtun", "Rabat", "Naxxar"],
    "Albania": ["Tirana", "Durrës", "Vlorë", "Elbasan", "Shkodër", "Fier", "Korçë", "Berat", "Lushnjë", "Kavajë"],
    "North Macedonia": ["Skopje", "Bitola", "Kumanovo", "Prilep", "Tetovo", "Veles", "Ohrid", "Gostivar", "Štip", "Strumica"],
    "Bosnia and Herzegovina": ["Sarajevo", "Banja Luka", "Tuzla", "Zenica", "Mostar", "Bihać", "Brčko", "Prijedor", "Trebinje", "Bijeljina"],
    "Montenegro": ["Podgorica", "Nikšić", "Pljevlja", "Bijelo Polje", "Cetinje", "Bar", "Herceg Novi", "Berane", "Budva", "Ulcinj"],
    "Moldova": ["Chișinău", "Tiraspol", "Bălți", "Bender", "Rîbnița", "Cahul", "Ungheni", "Soroca", "Orhei", "Comrat"],
    
    // Americas
    "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte"],
    "Canada": ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg", "Quebec City", "Hamilton", "Kitchener", "London", "Victoria", "Halifax", "Oshawa", "Windsor"],
    "Mexico": ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León", "Ciudad Juárez", "Zapopan", "Mérida", "San Luis Potosí", "Aguascalientes", "Hermosillo", "Saltillo", "Mexicali", "Culiacán"],
    "Brazil": ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Porto Alegre", "Belém", "Goiânia", "Guarulhos", "Campinas", "São Luís"],
    "Argentina": ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "San Miguel de Tucumán", "La Plata", "Mar del Plata", "Salta", "Santa Fe", "San Juan", "Resistencia", "Corrientes", "Neuquén", "Bahía Blanca", "Posadas"],
    "Colombia": ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Cúcuta", "Bucaramanga", "Pereira", "Santa Marta", "Ibagué", "Villavicencio", "Manizales", "Neiva", "Soledad", "Pasto"],
    "Peru": ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura", "Iquitos", "Cusco", "Huancayo", "Chimbote", "Tacna", "Pucallpa", "Juliaca", "Ica", "Sullana", "Ayacucho"],
    "Chile": ["Santiago", "Valparaíso", "Concepción", "La Serena", "Antofagasta", "Temuco", "Rancagua", "Talca", "Arica", "Chillán", "Iquique", "Los Ángeles", "Puerto Montt", "Coquimbo", "Osorno"],
    "Venezuela": ["Caracas", "Maracaibo", "Valencia", "Barquisimeto", "Maracay", "Ciudad Guayana", "Barcelona", "Maturín", "Ciudad Bolívar", "Cumaná", "Mérida", "San Cristóbal", "Puerto La Cruz", "Cabimas", "Barinas"],
    "Ecuador": ["Guayaquil", "Quito", "Cuenca", "Santo Domingo", "Machala", "Durán", "Manta", "Portoviejo", "Loja", "Ambato", "Esmeraldas", "Quevedo", "Riobamba", "Milagro", "Ibarra"],
    "Bolivia": ["Santa Cruz de la Sierra", "La Paz", "El Alto", "Cochabamba", "Sucre", "Oruro", "Tarija", "Potosí", "Sacaba", "Montero", "Trinidad", "Riberalta", "Yacuiba", "Warnes", "Quillacollo"],
    "Paraguay": ["Asunción", "Ciudad del Este", "San Lorenzo", "Luque", "Capiatá", "Lambaré", "Fernando de la Mora", "Limpio", "Ñemby", "Encarnación", "Mariano Roque Alonso", "Pedro Juan Caballero", "Itauguá", "Villa Elisa", "Caaguazú"],
    "Uruguay": ["Montevideo", "Salto", "Ciudad de la Costa", "Paysandú", "Las Piedras", "Rivera", "Maldonado", "Tacuarembó", "Melo", "Mercedes", "Artigas", "Minas", "San José de Mayo", "Durazno", "Florida"],
    "Costa Rica": ["San José", "Limón", "Alajuela", "San Francisco", "Desamparados", "Liberia", "Puntarenas", "Paraíso", "Curridabat", "San Vicente", "San Isidro", "Heredia", "Cartago", "Aserrí", "Nicoya"],
    "Panama": ["Panama City", "San Miguelito", "Tocumen", "David", "Arraiján", "Colón", "Las Cumbres", "La Chorrera", "Pacora", "Santiago", "Chitré", "Chilibre", "Vista Alegre", "Pedregal", "Alcalde Díaz"],
    "Guatemala": ["Guatemala City", "Mixco", "Villa Nueva", "Petapa", "San Juan Sacatepéquez", "Quetzaltenango", "Villa Canales", "Escuintla", "Chinautla", "Chimaltenango", "Huehuetenango", "Amatitlán", "Totonicapán", "Santa Lucía Cotzumalguapa", "Puerto Barrios"],
    "Honduras": ["Tegucigalpa", "San Pedro Sula", "Choloma", "La Ceiba", "El Progreso", "Villanueva", "Choluteca", "Comayagua", "Puerto Cortés", "La Lima", "Danlí", "Siguatepeque", "Juticalpa", "Tocoa", "Cofradía"],
    "El Salvador": ["San Salvador", "Soyapango", "Santa Ana", "San Miguel", "Mejicanos", "Apopa", "Delgado", "Sonsonate", "Ilopango", "Cuscatancingo", "Ahuachapán", "Usulután", "San Martín", "Zacatecoluca", "Chalatenango"],
    "Nicaragua": ["Managua", "León", "Masaya", "Matagalpa", "Chinandega", "Estelí", "Tipitapa", "Granada", "Ciudad Sandino", "Jinotega", "Juigalpa", "Bluefields", "Jinotepe", "Ocotal", "Somoto"],
    "Cuba": ["Havana", "Santiago de Cuba", "Camagüey", "Holguín", "Santa Clara", "Guantánamo", "Bayamo", "Las Tunas", "Cienfuegos", "Pinar del Río", "Matanzas", "Ciego de Ávila", "Sancti Spíritus", "Manzanillo", "Cárdenas"],
    "Dominican Republic": ["Santo Domingo", "Santiago de los Caballeros", "Santo Domingo Oeste", "Santo Domingo Este", "San Pedro de Macorís", "La Romana", "Higüey", "San Cristóbal", "Puerto Plata", "San Francisco de Macorís", "La Vega", "Concepción de La Vega", "Bonao", "Baní", "Moca"],
    "Jamaica": ["Kingston", "Spanish Town", "Portmore", "Montego Bay", "May Pen", "Mandeville", "Old Harbour", "Savanna-la-Mar", "Ocho Rios", "Port Antonio", "Half Way Tree", "Linstead", "St. Ann's Bay", "Bog Walk", "Constant Spring"],
    "Trinidad and Tobago": ["Port of Spain", "Chaguanas", "San Fernando", "Arima", "Marabella", "Point Fortin", "Tunapuna", "Sangre Grande", "Couva", "Diego Martin", "Penal", "Siparia", "Princes Town", "Rio Claro", "Scarborough"],
    "Haiti": ["Port-au-Prince", "Carrefour", "Delmas", "Cap-Haïtien", "Pétion-Ville", "Gonaïves", "Saint-Marc", "Les Cayes", "Port-de-Paix", "Jacmel", "Jérémie", "Hinche", "Petit-Goâve", "Léogâne", "Croix-des-Bouquets"],
    "Belize": ["Belize City", "San Ignacio", "Orange Walk", "Belmopan", "Dangriga", "Corozal", "San Pedro", "Benque Viejo del Carmen", "Punta Gorda", "Hopkins", "Placencia", "Caye Caulker", "Ladyville", "Valley of Peace", "Santa Elena"],
    
    // Africa
    "Egypt": ["Cairo", "Alexandria", "Giza", "Shubra El Kheima", "Port Said", "Suez", "Luxor", "Mansoura", "Tanta", "Asyut", "Ismailia", "Faiyum", "Zagazig", "Aswan", "Damietta"],
    "South Africa": ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein", "East London", "Pietermaritzburg", "Vereeniging", "Welkom", "Kimberley", "Rustenburg", "Polokwane", "Nelspruit", "George"],
    "Nigeria": ["Lagos", "Kano", "Ibadan", "Abuja", "Port Harcourt", "Benin City", "Kaduna", "Maiduguri", "Zaria", "Aba", "Jos", "Ilorin", "Oyo", "Enugu", "Abeokuta"],
    "Kenya": ["Nairobi", "Mombasa", "Nakuru", "Eldoret", "Kisumu", "Thika", "Ruiru", "Kikuyu", "Malindi", "Naivasha", "Kitale", "Kakamega", "Meru", "Nyeri", "Machakos"],
    "Ghana": ["Accra", "Kumasi", "Tamale", "Sekondi-Takoradi", "Ashaiman", "Sunyani", "Cape Coast", "Obuasi", "Teshie", "Tema", "Madina", "Koforidua", "Wa", "Techiman", "Ho"],
    "Ethiopia": ["Addis Ababa", "Dire Dawa", "Mek'ele", "Gondar", "Bahir Dar", "Hawassa", "Dessie", "Jimma", "Jijiga", "Shashamane", "Bishoftu", "Sodo", "Arba Minch", "Hosaena", "Harar"],
    "Tanzania": ["Dar es Salaam", "Mwanza", "Arusha", "Dodoma", "Mbeya", "Morogoro", "Tanga", "Zanzibar City", "Kigoma", "Moshi", "Tabora", "Iringa", "Singida", "Musoma", "Shinyanga"],
    "Morocco": ["Casablanca", "Rabat", "Fès", "Marrakech", "Agadir", "Tangier", "Meknès", "Oujda", "Kenitra", "Tétouan", "Safi", "Mohammedia", "Khouribga", "El Jadida", "Beni Mellal"],
    "Uganda": ["Kampala", "Gulu", "Lira", "Mbarara", "Jinja", "Bwizibwera", "Mbale", "Mukono", "Kasese", "Masaka", "Entebbe", "Njeru", "Kitgum", "Hoima", "Soroti"],
    "Algeria": ["Algiers", "Oran", "Constantine", "Batna", "Djelfa", "Sétif", "Annaba", "Sidi Bel Abbès", "Biskra", "Tébessa", "El Oued", "Skikda", "Tiaret", "Béjaïa", "Tlemcen"],
    "Sudan": ["Khartoum", "Omdurman", "Khartoum North", "Port Sudan", "Kassala", "Obeid", "Nyala", "Wad Medani", "El Fasher", "Kosti", "El Gadarif", "Geneina", "El Daein", "Atbara", "Kaduqli"],
    "Angola": ["Luanda", "Huambo", "Lobito", "Benguela", "Kuito", "Lubango", "Malanje", "Namibe", "Soyo", "Cabinda", "Uíge", "Saurimo", "Sumbe", "Ndalatando", "Menongue"],
    "Zimbabwe": ["Harare", "Bulawayo", "Chitungwiza", "Mutare", "Gweru", "Epworth", "Kwekwe", "Kadoma", "Masvingo", "Chinhoyi", "Norton", "Marondera", "Ruwa", "Chegutu", "Zvishavane"],
    "Mozambique": ["Maputo", "Matola", "Nampula", "Beira", "Chimoio", "Nacala", "Quelimane", "Tete", "Lichinga", "Pemba", "Xai-Xai", "Maxixe", "Inhambane", "Cuamba", "Angoche"],
    "Cameroon": ["Douala", "Yaoundé", "Bamenda", "Bafoussam", "Garoua", "Maroua", "Nkongsamba", "Ngaoundéré", "Bertoua", "Edéa", "Loum", "Kumba", "Foumban", "Mbouda", "Dschang"],
    "Ivory Coast": ["Abidjan", "Bouaké", "Daloa", "San-Pédro", "Yamoussoukro", "Korhogo", "Man", "Divo", "Gagnoa", "Anyama", "Abengourou", "Grand-Bassam", "Bondoukou", "Bingerville", "Odienné"],
    "Senegal": ["Dakar", "Touba", "Thiès", "Kaolack", "Saint-Louis", "Ziguinchor", "Mbour", "Rufisque", "Diourbel", "Tambacounda", "Louga", "Kolda", "Pikine", "Guédiawaye", "Richard Toll"],
    "Madagascar": ["Antananarivo", "Toamasina", "Antsirabe", "Mahajanga", "Fianarantsoa", "Toliara", "Antsiranana", "Ambovombe", "Manakara", "Morondava", "Nosy Be", "Farafangana", "Betioky", "Ambatondrazaka", "Ihosy"],
    "Mali": ["Bamako", "Sikasso", "Mopti", "Koutiala", "Kayes", "Ségou", "Gao", "Kati", "Kolokani", "San", "Markala", "Bougouni", "Djenné", "Niono", "Bla"],
    "Zambia": ["Lusaka", "Kitwe", "Ndola", "Kabwe", "Chingola", "Mufulira", "Livingstone", "Luanshya", "Kasama", "Chipata", "Kalulushi", "Mazabuka", "Chililabombwe", "Mongu", "Solwezi"],
    "Rwanda": ["Kigali", "Butare", "Gitarama", "Ruhengeri", "Gisenyi", "Byumba", "Cyangugu", "Kibungo", "Kibuye", "Rwamagana", "Nyanza", "Muhanga", "Musanze", "Huye", "Rubavu"],
    "Tunisia": ["Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabès", "Ariana", "Gafsa", "Monastir", "La Marsa", "Kasserine", "Ben Arous", "Hammam-Lif", "Nabeul", "Zarzis"],
    "Libya": ["Tripoli", "Benghazi", "Misrata", "Bayda", "Zawiya", "Zliten", "Ajdabiya", "Tobruk", "Sabha", "Derna", "Gharyan", "Khoms", "Sirte", "Brak", "Marj"],
    "Botswana": ["Gaborone", "Francistown", "Molepolole", "Maun", "Selebi-Phikwe", "Serowe", "Kanye", "Mochudi", "Mahalapye", "Palapye", "Tlokweng", "Ramotswa", "Lobatse", "Mogoditshane", "Tonota"],
    "Namibia": ["Windhoek", "Rundu", "Walvis Bay", "Oshakati", "Swakopmund", "Katima Mulilo", "Grootfontein", "Rehoboth", "Otjiwarongo", "Keetmanshoop", "Tsumeb", "Gobabis", "Okahandja", "Outapi", "Ongwediva"],
    "Mauritius": ["Port Louis", "Beau Bassin-Rose Hill", "Vacoas-Phoenix", "Curepipe", "Quatre Bornes", "Triolet", "Goodlands", "Centre de Flacq", "Mahebourg", "Saint Pierre", "Bambous", "Grand Baie", "Pamplemousses", "Rivière du Rempart", "Rose Belle"],
    "Gabon": ["Libreville", "Port-Gentil", "Franceville", "Oyem", "Moanda", "Mouila", "Lambaréné", "Tchibanga", "Koulamoutou", "Makokou", "Bitam", "Gamba", "Lastoursville", "Mékambo", "Minvoul"],
    
    // Oceania
    "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Newcastle", "Canberra", "Sunshine Coast", "Wollongong", "Hobart", "Geelong", "Townsville", "Cairns", "Darwin"],
    "New Zealand": ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Napier", "Dunedin", "Palmerston North", "Nelson", "Rotorua", "New Plymouth", "Whangarei", "Invercargill", "Whanganui", "Gisborne"],
    "Papua New Guinea": ["Port Moresby", "Lae", "Arawa", "Mount Hagen", "Popondetta", "Madang", "Kokopo", "Mendi", "Kimbe", "Goroka", "Wewak", "Vanimo", "Kavieng", "Wabag", "Daru"],
    "Fiji": ["Suva", "Nasinu", "Lautoka", "Nadi", "Labasa", "Ba", "Nausori", "Savusavu", "Sigatoka", "Levuka", "Tavua", "Rakiraki", "Korovou", "Lami", "Vatukoula"],
    "Solomon Islands": ["Honiara", "Gizo", "Auki", "Kirakira", "Buala", "Tulagi", "Lata", "Munda", "Noro", "Taro"],
    "Samoa": ["Apia", "Vaitele", "Faleula", "Siusega", "Malie", "Vaiusu", "Nofoalii", "Leulumoega", "Lufilufi", "Safotulafai"],
    "Vanuatu": ["Port Vila", "Luganville", "Norsup", "Isangel", "Sola", "Lakatoro", "Saratamata", "Port-Olry", "Lenakel", "Longana"],
    "Tonga": ["Nuku'alofa", "Neiafu", "Haveluloto", "Vaini", "Pangai", "Ohonua", "'Eua", "Hihifo", "Mu'a", "'Ohonua"],
    "Micronesia": ["Palikir", "Weno", "Kolonia", "Tofol", "Colonia"],
    "Palau": ["Ngerulmud", "Koror", "Airai", "Melekeok", "Ngarchelong"],
    "Kiribati": ["South Tarawa", "Betio", "Bikenibeu", "Teaoraereke", "Bairiki"],
    "Marshall Islands": ["Majuro", "Ebeye", "Jabor", "Wotje", "Mili"],
    "Nauru": ["Yaren", "Denigomodu", "Aiwo", "Anabar", "Anetan"],
    "Tuvalu": ["Funafuti", "Vaiaku", "Tanrake", "Toga", "Asau"],
}

const touristEntrySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    age: z.string().min(1, "Age is required"),
    nationality: z.string().min(1, "Required"),
    origin: z.string().min(1, "Required"),
    isForeign: z.boolean(),
    gender: z.string().min(1, "Required"),
    purpose: z.string().min(1, "Required"),
    transport: z.string().min(1, "Required"),
    destination: z.string().min(1, "Destination is required"),
    lengthOfStay: z.string().min(1, "Required"),
    isOvernight: z.boolean(),
})

const formSchema = z.object({
    visitDate: z.date({
        message: "Please select a visit date",
    }),
    visitTime: z.string().min(1, "Visit time is required"),
    boatName: z.string().min(1, "Boat name is required"),
    boatOperator: z.string().min(1, "Boat operator is required"),
    boatCaptain: z.string().min(1, "Boat captain is required"),
    boatCrew: z.string().min(1, "Boat crew name is required"),
    touristEntries: z.array(touristEntrySchema).min(1, "At least 1 tourist required").max(10, "Maximum 10 tourists per boat"),
})

interface TourismFormProps {
    editingRecord?: any
    onSaveComplete?: () => void
    onCancel?: () => void
}

export function TourismForm({ editingRecord, onSaveComplete, onCancel }: TourismFormProps = {}) {
    const [boats, setBoats] = React.useState<Boat[]>([])
    const [boatSuggestions, setBoatSuggestions] = React.useState<Boat[]>([])
    const [showBoatSuggestions, setShowBoatSuggestions] = React.useState(false)
    
    const [operators, setOperators] = React.useState<string[]>([])
    const [operatorSuggestions, setOperatorSuggestions] = React.useState<string[]>([])
    const [showOperatorSuggestions, setShowOperatorSuggestions] = React.useState(false)
    
    const [captains, setCaptains] = React.useState<string[]>([])
    const [captainSuggestions, setCaptainSuggestions] = React.useState<string[]>([])
    const [showCaptainSuggestions, setShowCaptainSuggestions] = React.useState(false)
    
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [submitError, setSubmitError] = React.useState<string | null>(null)
    const [submitSuccess, setSubmitSuccess] = React.useState(false)
    const [isEditMode, setIsEditMode] = React.useState(false)
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            visitDate: new Date(),
            visitTime: "",
            boatName: "",
            boatOperator: "",
            boatCaptain: "",
            boatCrew: "",
            touristEntries: [
                {
                    name: "",
                    age: "",
                    nationality: "Philippines",
                    origin: "Manila", // Default city
                    isForeign: false,
                    gender: "male", // Default gender
                    purpose: "leisure", // Default purpose
                    transport: "land", // Default transport
                    destination: "island_tour", // Default destination
                    lengthOfStay: "0",
                    isOvernight: false,
                },
            ],
        },
    })
    
    // Fetch boats on component mount
    React.useEffect(() => {
        const fetchBoats = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/boats')
                const result = await response.json()
                // API returns array directly
                const boatData: Boat[] = Array.isArray(result) ? result : (result.value || result.data || [])
                setBoats(boatData)
                
                // Extract unique operators and captains
                const uniqueOperators: string[] = [...new Set(boatData.map(b => b.operator_name))]
                const uniqueCaptains: string[] = [...new Set(boatData.map(b => b.captain_name))]
                setOperators(uniqueOperators)
                setCaptains(uniqueCaptains)
            } catch (error) {
                console.error('Error fetching boats:', error)
            }
        }
        fetchBoats()
    }, [])
    
    // Load editing record data
    React.useEffect(() => {
        if (editingRecord) {
            console.log('=== LOADING EDITING RECORD ===')
            console.log('Full editingRecord:', editingRecord)
            console.log('editingRecord.id:', editingRecord.id)
            console.log('editingRecord.trip_date:', editingRecord.trip_date)
            
            setIsEditMode(true)
            setSubmitSuccess(false)
            setSubmitError(null)
            
            // Transform backend data to form format
            const trip = editingRecord
            
            // Extract crew from trip remarks (format: "Crew: John Doe")
            let crewName = "";
            if (trip.remarks && trip.remarks.startsWith('Crew: ')) {
                crewName = trip.remarks.substring(6); // Remove "Crew: " prefix
            }
            
            form.reset({
                visitDate: new Date(trip.trip_date),
                visitTime: trip.departure_time.substring(0, 5), // HH:mm format
                boatName: trip.boat?.boat_name || "",
                boatOperator: trip.boat?.operator_name || "",
                boatCaptain: trip.boat?.captain_name || "",
                boatCrew: crewName, // Load from trip remarks
                touristEntries: trip.tourists?.map((tourist: any) => ({
                    name: tourist.full_name || `${tourist.first_name} ${tourist.last_name}`,
                    age: tourist.age?.toString() || "",
                    gender: tourist.gender || "male", // Default if empty
                    isForeign: tourist.type === "foreign",
                    nationality: tourist.nationality || "Philippines", // Default if empty
                    origin: tourist.origin_city || "Manila", // Default if empty
                    purpose: tourist.purpose || "leisure", // Default if empty
                    transport: tourist.transport_mode || "land", // Default if empty
                    destination: tourist.destination || "island_tour", // Default if empty
                    isOvernight: tourist.accommodation_type !== "day_tour",
                    lengthOfStay: tourist.duration_days?.toString() || "0",
                })) || [{
                    name: "",
                    age: "",
                    nationality: "Philippines",
                    origin: "Manila", // Default city
                    isForeign: false,
                    gender: "male", // Default gender
                    purpose: "leisure", // Default purpose
                    transport: "land", // Default transport
                    destination: "island_tour", // Default destination
                    lengthOfStay: "0",
                    isOvernight: false,
                }]
            })
        } else {
            setIsEditMode(false)
        }
    }, [editingRecord, form])
    
    // Handle boat name input and show suggestions
    const handleBoatNameChange = (value: string) => {
        if (value.trim().length > 0) {
            const filtered = boats.filter(boat => 
                boat.boat_name.toLowerCase().includes(value.toLowerCase())
            )
            setBoatSuggestions(filtered)
            setShowBoatSuggestions(true)
        } else {
            setBoatSuggestions([])
            setShowBoatSuggestions(false)
        }
    }
    
    // Handle operator input and show suggestions
    const handleOperatorChange = (value: string) => {
        if (value.trim().length > 0) {
            const filtered = operators.filter(op => 
                op.toLowerCase().includes(value.toLowerCase())
            )
            setOperatorSuggestions(filtered)
            setShowOperatorSuggestions(true)
        } else {
            setOperatorSuggestions([])
            setShowOperatorSuggestions(false)
        }
    }
    
    // Handle captain input and show suggestions
    const handleCaptainChange = (value: string) => {
        if (value.trim().length > 0) {
            const filtered = captains.filter(cap => 
                cap.toLowerCase().includes(value.toLowerCase())
            )
            setCaptainSuggestions(filtered)
            setShowCaptainSuggestions(true)
        } else {
            setCaptainSuggestions([])
            setShowCaptainSuggestions(false)
        }
    }
    
    // Auto-populate boat details when boat is selected
    const selectBoat = (boat: Boat) => {
        form.setValue('boatName', boat.boat_name)
        form.setValue('boatOperator', boat.operator_name)
        form.setValue('boatCaptain', boat.captain_name)
        setShowBoatSuggestions(false)
        setShowOperatorSuggestions(false)
        setShowCaptainSuggestions(false)
    }
    
    // Select operator from suggestions
    const selectOperator = (operator: string) => {
        form.setValue('boatOperator', operator)
        setShowOperatorSuggestions(false)
    }
    
    // Select captain from suggestions
    const selectCaptain = (captain: string) => {
        form.setValue('boatCaptain', captain)
        setShowCaptainSuggestions(false)
    }
    
    // Watch for tourist foreign status changes
    const watchTouristEntries = form.watch('touristEntries')
    
    // Auto-set nationality to Philippines if not foreign
    React.useEffect(() => {
        watchTouristEntries.forEach((entry, index) => {
            if (!entry.isForeign && entry.nationality !== 'Philippines') {
                form.setValue(`touristEntries.${index}.nationality`, 'Philippines')
            }
        })
    }, [watchTouristEntries, form])
    
    // Auto-set days to 0 if not overnight
    React.useEffect(() => {
        watchTouristEntries.forEach((entry, index) => {
            if (!entry.isOvernight && entry.lengthOfStay !== '0') {
                form.setValue(`touristEntries.${index}.lengthOfStay`, '0')
            }
        })
    }, [watchTouristEntries, form])
    
    // Auto-classify as staycation if 3+ days
    React.useEffect(() => {
        watchTouristEntries.forEach((entry, index) => {
            const days = parseFloat(entry.lengthOfStay || '0')
            if (days >= 3 && !entry.isOvernight) {
                form.setValue(`touristEntries.${index}.isOvernight`, true)
            }
        })
    }, [watchTouristEntries, form])
    
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "touristEntries",
    })
    
    const addTouristEntry = () => {
        if (fields.length < 10) {
            append({
                name: "",
                age: "",
                nationality: "Philippines",
                origin: "Manila", // Default city
                isForeign: false,
                gender: "male", // Default gender instead of empty
                purpose: "leisure", // Default purpose instead of empty
                transport: "land", // Default transport instead of empty
                destination: "island_tour", // Default destination
                lengthOfStay: "0",
                isOvernight: false,
            })
        }
    }
    
    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        setSubmitError(null)
        setSubmitSuccess(false)
        
        console.log('=== SUBMIT DEBUG ===')
        console.log('isEditMode:', isEditMode)
        console.log('editingRecord:', editingRecord)
        console.log('editingRecord?.id:', editingRecord?.id)
        console.log('Will call:', isEditMode && editingRecord?.id ? 'UPDATE' : 'CREATE')
        
        const savePromise = isEditMode && editingRecord?.id
            ? updateTourismRecord(editingRecord.id, values)
            : createTourismRecord(values)
        
        savePromise
            .then((response) => {
                console.log('Tourism record saved:', response)
                setSubmitSuccess(true)
                
                const action = isEditMode ? 'updated' : 'recorded'
                
                // Show success message
                alert(
                    `✅ Tourist arrivals ${action} successfully!\n\n` +
                    `Trip Details:\n` +
                    `• Date: ${format(values.visitDate, 'PPP')}\n` +
                    `• Time: ${values.visitTime}\n` +
                    `• Boat: ${values.boatName}\n` +
                    `• Operator: ${values.boatOperator}\n` +
                    `• Captain: ${values.boatCaptain}\n\n` +
                    `Tourist Summary:\n` +
                    `• Total Tourists: ${response.summary?.total_tourists || values.touristEntries.length}\n` +
                    `• Foreign: ${response.summary?.foreign || 0}\n` +
                    `• Domestic: ${response.summary?.domestic || 0}\n\n` +
                    `The data has been saved to the database.`
                )
                
                // Call onSaveComplete callback
                if (onSaveComplete) {
                    onSaveComplete()
                }
                
                // Reset form after successful submission (only if not editing)
                if (!isEditMode) {
                    form.reset({
                        visitDate: new Date(),
                        visitTime: "",
                        boatName: "",
                        boatOperator: "",
                        boatCaptain: "",
                        boatCrew: "",
                        touristEntries: [
                            {
                                name: "",
                                age: "",
                                nationality: "Philippines",
                                origin: "Manila", // Default city
                                isForeign: false,
                                gender: "male", // Default gender
                                purpose: "leisure", // Default purpose
                                transport: "land", // Default transport
                                destination: "island_tour", // Default destination
                                lengthOfStay: "0",
                                isOvernight: false,
                            }
                        ]
                    })
                }
            })
            .catch((error) => {
                console.error('Error creating tourism record:', error)
                setSubmitError(error.message || 'Failed to save tourist arrivals. Please try again.')
                
                alert(
                    `❌ Error: Failed to save tourist arrivals\n\n` +
                    `${error.message || 'Please check your internet connection and try again.'}\n\n` +
                    `Your data has not been lost. You can try submitting again.`
                )
            })
            .finally(() => {
                setIsSubmitting(false)
            })
    }
    
    return (
        <div className="w-full px-2 sm:px-0">
        <div className="pb-4 sm:pb-6">
        <h3 className="text-xl sm:text-2xl font-semibold">
            {isEditMode ? '✏️ Edit Tourist Arrival Record' : 'Tourist Arrival Recording'}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
        {isEditMode 
            ? 'Update the trip details and tourist information. You can add or remove tourists from this trip.'
            : 'Record each tourist who boards your boat. Simply collect their information when they arrive.'}
        </p>
        {isEditMode && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> You can add more tourists by clicking "Add Another Tourist" below, or remove tourists you don't need.
                </p>
            </div>
        )}
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
        
        {/* Visit Date and Boat Information */}
        <div className="rounded-lg border bg-muted/50 p-4 md:p-5 lg:p-6">
        <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Trip Details & Your Boat Information</h4>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {/* Visit Date */}
        <FormField
        control={form.control}
        name="visitDate"
        render={({ field }) => (
            <FormItem className="flex flex-col">
            <FormLabel className="text-sm md:text-base">Date of Trip</FormLabel>
            <FormControl>
                <DateTimePicker
                date={field.value}
                onDateChange={field.onChange}
                />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        
        {/* Visit Time */}
        <FormField
        control={form.control}
        name="visitTime"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Departure Time</FormLabel>
            <FormControl>
                <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        
        {/* Boat Name with Autocomplete */}
        <FormField
        control={form.control}
        name="boatName"
        render={({ field }) => (
            <FormItem className="relative">
            <FormLabel>Your Boat Name</FormLabel>
            <FormControl>
                <div className="relative">
                    <Input 
                        placeholder="Type your boat name..." 
                        value={field.value}
                        onChange={(e) => {
                            field.onChange(e.target.value)
                            handleBoatNameChange(e.target.value)
                        }}
                        onFocus={(e) => {
                            const value = e.target.value
                            if (value) {
                                handleBoatNameChange(value)
                            }
                        }}
                        onBlur={() => {
                            // Delay to allow click on suggestion
                            setTimeout(() => setShowBoatSuggestions(false), 200)
                        }}
                    />
                    {showBoatSuggestions && boatSuggestions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-60 overflow-auto">
                            {boatSuggestions.map((boat) => (
                                <button
                                    key={boat.id}
                                    type="button"
                                    className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                    onClick={() => selectBoat(boat)}
                                >
                                    <div className="font-medium">{boat.boat_name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        Captain: {boat.captain_name} • Operator: {boat.operator_name}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </FormControl>
            <FormDescription>Your boat's name</FormDescription>
            <FormMessage />
            </FormItem>
        )}
        />
        
        {/* Boat Operator with Autocomplete */}
        <FormField
        control={form.control}
        name="boatOperator"
        render={({ field }) => (
            <FormItem className="relative">
            <FormLabel>Boat Operator Name</FormLabel>
            <FormControl>
                <div className="relative">
                    <Input 
                        placeholder="Type to search operators..." 
                        value={field.value}
                        onChange={(e) => {
                            field.onChange(e.target.value)
                            handleOperatorChange(e.target.value)
                        }}
                        onFocus={(e) => {
                            const value = e.target.value
                            if (value) {
                                handleOperatorChange(value)
                            }
                        }}
                        onBlur={() => {
                            // Delay to allow click on suggestion
                            setTimeout(() => setShowOperatorSuggestions(false), 200)
                        }}
                    />
                    {showOperatorSuggestions && operatorSuggestions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-60 overflow-auto">
                            {operatorSuggestions.map((operator, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                    onClick={() => selectOperator(operator)}
                                >
                                    <div className="font-medium">{operator}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </FormControl>
            <FormDescription>Operator/owner of the boat</FormDescription>
            <FormMessage />
            </FormItem>
        )}
        />
        
        {/* Boat Captain with Autocomplete */}
        <FormField
        control={form.control}
        name="boatCaptain"
        render={({ field }) => (
            <FormItem className="relative">
            <FormLabel>Captain Name</FormLabel>
            <FormControl>
                <div className="relative">
                    <Input 
                        placeholder="Type to search captains..." 
                        value={field.value}
                        onChange={(e) => {
                            field.onChange(e.target.value)
                            handleCaptainChange(e.target.value)
                        }}
                        onFocus={(e) => {
                            const value = e.target.value
                            if (value) {
                                handleCaptainChange(value)
                            }
                        }}
                        onBlur={() => {
                            // Delay to allow click on suggestion
                            setTimeout(() => setShowCaptainSuggestions(false), 200)
                        }}
                    />
                    {showCaptainSuggestions && captainSuggestions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-60 overflow-auto">
                            {captainSuggestions.map((captain, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                    onClick={() => selectCaptain(captain)}
                                >
                                    <div className="font-medium">{captain}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </FormControl>
            <FormDescription>Captain operating this trip</FormDescription>
            <FormMessage />
            </FormItem>
        )}
        />
        
        {/* Boat Crew */}
        <FormField
        control={form.control}
        name="boatCrew"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Crew Members</FormLabel>
            <FormControl>
                <Input placeholder="Enter crew names (optional)" {...field} />
            </FormControl>
            <FormMessage />
            </FormItem>
        )}
        />
        </div>
        </div>
        
        {/* Tourist Entries */}
        <div className="space-y-4">
        <div className="pb-2">
        <h4 className="text-base sm:text-lg font-semibold">Tourist Data ({fields.length}/10)</h4>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
        Collect basic details from each tourist boarding this trip (maximum 10 per trip).
        </p>
        </div>
        
        {fields.map((field, index) => (
            <div key={field.id} className="rounded-lg border bg-card p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h5 className="font-semibold text-base sm:text-lg">Tourist #{index + 1}</h5>
            {fields.length > 1 && (
                <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                <Trash2 className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Remove</span>
                </Button>
            )}
            </div>
            
            <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {/* Column 1: Personal Identity */}
            <div className="space-y-3 md:space-y-4">
            {/* Name */}
            <FormField
            control={form.control}
            name={`touristEntries.${index}.name`}
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-sm md:text-base">Tourist Name</FormLabel>
                <FormControl>
                <Input placeholder="Ask for their full name" className="text-sm md:text-base" {...field} />
                </FormControl>
                <FormDescription className="h-5 text-xs md:text-sm">&nbsp;</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            
            {/* Age */}
            <FormField
            control={form.control}
            name={`touristEntries.${index}.age`}
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-sm md:text-base">Age</FormLabel>
                <FormControl>
                <Input type="number" placeholder="e.g., 25" className="text-sm md:text-base" {...field} />
                </FormControl>
                <FormDescription className="h-5 text-xs md:text-sm">&nbsp;</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            
            {/* Gender */}
            <FormField
            control={form.control}
            name={`touristEntries.${index}.gender`}
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-sm md:text-base">Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                <SelectTrigger className="text-sm md:text-base">
                <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                </FormControl>
                <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                </SelectContent>
                </Select>
                <FormDescription className="h-5 text-xs md:text-sm">&nbsp;</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            </div>
            
            {/* Column 2: Origin & Classification */}
            <div className="space-y-3 md:space-y-4">
            {/* Foreign/Domestic - Moved up as it determines other fields */}
            <FormField
            control={form.control}
            name={`touristEntries.${index}.isForeign`}
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-sm md:text-base">Visitor Type</FormLabel>
                <FormControl>
                <div className="flex items-center space-x-2 h-10 rounded-md border px-3">
                <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                    field.onChange(checked)
                    // Auto-set nationality when toggling
                    if (!checked) {
                        form.setValue(`touristEntries.${index}.nationality`, 'Philippines')
                    } else {
                        form.setValue(`touristEntries.${index}.nationality`, '')
                    }
                }}
                />
                <span className="text-xs md:text-sm text-muted-foreground">Foreign/International</span>
                </div>
                </FormControl>
                <FormDescription className="h-5 text-xs md:text-sm">&nbsp;</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            
            {/* Nationality/Country */}
            <FormField
            control={form.control}
            name={`touristEntries.${index}.nationality`}
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-sm md:text-base">Nationality</FormLabel>
                {form.watch(`touristEntries.${index}.isForeign`) ? (
                    <Select 
                        onValueChange={(value) => {
                            field.onChange(value)
                            // Reset origin when country changes
                            form.setValue(`touristEntries.${index}.origin`, '')
                        }} 
                        value={field.value}
                    >
                    <FormControl>
                    <SelectTrigger className="text-sm md:text-base">
                        <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-60">
                        {Object.keys(countriesWithCities).sort().map((country) => (
                            <SelectItem key={country} value={country}>
                                {country}
                            </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                ) : (
                    <FormControl>
                    <Input 
                        value="Philippines" 
                        readOnly 
                        className="bg-muted text-sm md:text-base"
                    />
                    </FormControl>
                )}
                <FormDescription className="h-5 text-xs md:text-sm">&nbsp;</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            {/* Origin (City/Region) - Based on selected country */}
            <FormField
            control={form.control}
            name={`touristEntries.${index}.origin`}
            render={({ field }) => {
                const selectedCountry = form.watch(`touristEntries.${index}.nationality`) || 'Philippines'
                const availableCities = countriesWithCities[selectedCountry] || []
                const isOtherCity = field.value && !availableCities.includes(field.value) && field.value !== 'other'
                
                return (
                <FormItem>
                <FormLabel className="text-sm md:text-base">Where They're Coming From</FormLabel>
                <Select 
                    onValueChange={(value) => {
                        if (value === 'other') {
                            field.onChange('')
                        } else {
                            field.onChange(value)
                        }
                    }} 
                    value={isOtherCity ? 'other' : field.value}
                >
                <FormControl>
                <SelectTrigger className="text-sm md:text-base">
                    <SelectValue placeholder={availableCities.length > 0 ? "Select city" : "Select country first"} />
                </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-60">
                    {availableCities.length > 0 ? (
                        <>
                        {availableCities.map((city) => (
                            <SelectItem key={city} value={city}>
                                {city}
                            </SelectItem>
                        ))}
                        <SelectItem value="other">
                            Other (Please specify)
                        </SelectItem>
                        </>
                    ) : (
                        <SelectItem value="unknown" disabled>
                            No cities available
                        </SelectItem>
                    )}
                </SelectContent>
                </Select>
                
                {/* Show text input when "Other" is selected */}
                {(isOtherCity || field.value === '') && selectedCountry && availableCities.length > 0 && (
                    <FormControl>
                    <Input 
                        placeholder="Please specify city/region"
                        value={isOtherCity ? field.value : ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="mt-2 text-sm md:text-base"
                    />
                    </FormControl>
                )}
                
                <FormDescription className="h-5 text-xs md:text-sm">
                    {isOtherCity ? "Specify city/region" : "\u00A0"}
                </FormDescription>
                <FormMessage />
                </FormItem>
                )
            }}
            />
            
            {/* Purpose */}
            <FormField
            control={form.control}
            name={`touristEntries.${index}.purpose`}
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-sm md:text-base">Why Are They Visiting?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                <SelectTrigger className="text-sm md:text-base">
                <SelectValue placeholder="Ask their purpose" />
                </SelectTrigger>
                </FormControl>
                <SelectContent>
                <SelectItem value="leisure">Leisure</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="official">Official</SelectItem>
                <SelectItem value="others">Others</SelectItem>
                </SelectContent>
                </Select>
                <FormDescription className="h-5 text-xs md:text-sm">&nbsp;</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            </div>
            
            {/* Column 3: Travel & Stay Details */}
            <div className="space-y-3 md:space-y-4">
            {/* Transport */}
            <FormField
            control={form.control}
            name={`touristEntries.${index}.transport`}
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-sm md:text-base">How Did They Get Here?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                <SelectTrigger className="text-sm md:text-base">
                <SelectValue placeholder="Ask their transport" />
                </SelectTrigger>
                </FormControl>
                <SelectContent>
                <SelectItem value="land">Land (Bus/Car/Van)</SelectItem>
                <SelectItem value="air">Air (Airplane)</SelectItem>
                <SelectItem value="sea">Sea (Boat/Ferry)</SelectItem>
                </SelectContent>
                </Select>
                <FormDescription className="h-5 text-xs md:text-sm">&nbsp;</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            
            {/* Destination */}
            <FormField
            control={form.control}
            name={`touristEntries.${index}.destination`}
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-sm md:text-base">Which Destination?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                <SelectTrigger className="text-sm md:text-base">
                <SelectValue placeholder="Ask their destination" />
                </SelectTrigger>
                </FormControl>
                <SelectContent>
                <SelectItem value="island_tour">Island Tour</SelectItem>
                <SelectItem value="juag_lagoon">Juag Lagoon</SelectItem>
                <SelectItem value="cave_diving">Cave Diving</SelectItem>
                <SelectItem value="beach">Beach</SelectItem>
                </SelectContent>
                </Select>
                <FormDescription className="h-5 text-xs md:text-sm">&nbsp;</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            
            {/* Overnight - Auto-enabled if 3+ days */}
            <FormField
            control={form.control}
            name={`touristEntries.${index}.isOvernight`}
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-sm md:text-base">Are They Staying Overnight?</FormLabel>
                <FormControl>
                <div className="flex items-center space-x-2 h-10 rounded-md border px-3">
                <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                    field.onChange(checked)
                    // Auto-set days to 0 if unchecking overnight
                    if (!checked) {
                        form.setValue(`touristEntries.${index}.lengthOfStay`, '0')
                    }
                }}
                />
                <span className="text-xs md:text-sm text-muted-foreground">Yes, staying overnight</span>
                </div>
                </FormControl>
                <FormDescription className="h-5 text-xs md:text-sm">
                    {parseFloat(form.watch(`touristEntries.${index}.lengthOfStay`) || '0') >= 3 ? "Staycation (3+ nights)" : "\u00A0"}
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            
            {/* Length of Stay - Auto 0 if not overnight */}
            <FormField
            control={form.control}
            name={`touristEntries.${index}.lengthOfStay`}
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-sm md:text-base">Length of Stay (days)</FormLabel>
                <FormControl>
                <Input 
                    type="number" 
                    step="0.5" 
                    placeholder="0" 
                    className={`text-sm md:text-base ${!form.watch(`touristEntries.${index}.isOvernight`) ? "bg-muted" : ""}`}
                    {...field}
                    readOnly={!form.watch(`touristEntries.${index}.isOvernight`)}
                    onChange={(e) => {
                        field.onChange(e)
                        const days = parseFloat(e.target.value || '0')
                        // Auto-enable overnight if 3+ days
                        if (days >= 3) {
                            form.setValue(`touristEntries.${index}.isOvernight`, true)
                        }
                    }}
                />
                </FormControl>
                <FormDescription className="h-5 text-xs md:text-sm">
                    {!form.watch(`touristEntries.${index}.isOvernight`) ? "0 days" : "Number of nights"}
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            
            
            </div>
            </div>
            </div>
        ))}
        </div>
        
        {/* Submit Buttons */}
        {submitError && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                <p className="text-sm text-destructive font-medium">❌ {submitError}</p>
            </div>
        )}
        
        {submitSuccess && (
            <div className="p-4 bg-green-50 border border-green-500 rounded-lg">
                <p className="text-sm text-green-700 font-medium">✅ Tourist arrivals recorded successfully!</p>
            </div>
        )}
        
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
            disabled={isSubmitting}
        >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting 
              ? 'Saving...' 
              : isEditMode 
                ? 'Update Trip Record' 
                : 'Submit Trip Record'}
        </Button>
        <Button
        type="button"
        variant="outline"
        onClick={() => {
            form.reset()
            setSubmitError(null)
            setSubmitSuccess(false)
        }}
        className="w-full sm:w-auto"
        disabled={isSubmitting}
        >
        Reset Form
        </Button>
        </div>
        <Button
        type="button"
        variant={isEditMode ? "default" : "outline"}
        onClick={addTouristEntry}
        disabled={fields.length >= 10}
        className={`gap-2 w-full sm:w-auto ${isEditMode ? 'bg-green-600 hover:bg-green-700' : ''}`}
        >
        <Plus className="h-4 w-4" />
        {isEditMode ? `Add More Tourists (${fields.length}/10)` : `Add Another Tourist (${fields.length}/10)`}
        </Button>
        </div>
        </form>
        </Form>
        </div>
    )
}
