#UNIFI SOLUTIONS

run db  cd to /ddl-scripts=> psql -U postgres -h localhost -f databaseDefinitions.sql -d unifi -p 5432
run project cd server/src => nodemon index.ts

