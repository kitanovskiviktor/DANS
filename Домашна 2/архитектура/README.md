### Концептуална архитектура
 
###### 1. Data Collection (Python):
 
Програмата користи Python за филтрирање и преземање податоци од надворешен извор (македонска берза).
 
###### 2. Data Storage (PostgreSQL):
 
Податоците се чуваат во релациона база на податоци PostgreSQL.
 
###### 3. API Backend (Node.js):
 
Backend системот користи Node.js за креирање API кој овозможува пристап до податоците од базата.
 
###### 4. Frontend (ReactJS):
 
ReactJS frontend комуницира со API-то за преземање и визуелизација на податоците за корисникот.
 
#### Извршна архитектура
 
###### Python Data Collector:
 
Програма за преземање податоци од берзата.
 
###### PostgreSQL Database:
 
База со соодветна табела за брз пристап до податоците.
 
###### Node.js API Server:
 
Сервер кој прима HTTP барања, ги процесира и враќа JSON одговори.
 
Поврзување со PostgreSQL преку pg.
 
###### ReactJS Frontend:
 
Веб апликација за визуелизација на податоците.
 
### Имплементациона архитектура
 
###### Python:
 
Libraries: BeautifulSoup за преземање податоци, psycopg2 за внесување во PostgreSQL.
 
Script structure:
 
main.py: целосен извршен код
 
###### PostgreSQL:
 
Табели:
 
stock_data: Колони за код, минимална цена, максимална цена, просечна цена и други индикатори.
  
###### Node.js:
 
Framework: Express.js.
 
Dependencies: pg за база, cors за Cross-Origin Resource Sharing.
 
Endpoints:
 
GET /api/codes: Преземање на податоците.
 
POST /api/codestats: Преземање на податоците мапирани за минимална цена, максимална цена и просечна цена.
 
###### ReactJS:
 
Libraries: axios за HTTP барања.
 
Компоненти:
 
HomeComponent: Визуелизација на домашната страна
 
CompaniesComponent: Приказ на сите акции од базата со нивните податоци.
 
PredictionComponent: Приказ на една акција според код и информација за нејзината предикција во иднина.