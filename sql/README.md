# mdnd-sql

## Config

- web users "admin" and "user" password in "data.sql"
- db user "pgp" password in "meta.sql"
- db name change in "meta.sql", "package.json"

## Install

```
# posgresql
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
sudo wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install postgresql-13

# setup
yarn setup

# more
yarn run
```
