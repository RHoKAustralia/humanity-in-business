DB=hib_test
DB_USER=root
TEST_DATABASE_URL=postgresql://root@localhost/hib_test
DB_CONTAINER_NAME=hib_test

if [ "$(docker ps -aq -f name=$DB_CONTAINER_NAME)" ]; then
  echo "--- remove container"
  docker rm -f $DB_CONTAINER_NAME
fi

echo "--- start container"
docker run -d --name $DB_CONTAINER_NAME -p 5432:5432 -e POSTGRES_DB=$DB -e POSTGRES_USER=$DB_USER circleci/postgres:11.4-alpine-ram

# Wait for db container to start
echo "--- Wait for database creation"
while [ ! "$(psql -d $TEST_DATABASE_URL -q -c "SELECT 1")" ];
do
  sleep 1s
  echo "--- Wait for database creation"
done

echo "--- import data"
psql -d $TEST_DATABASE_URL < "sql/setup.sql"