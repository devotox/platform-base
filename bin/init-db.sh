

echo ""
echo "########################################################"
echo "####              Database Initiate                 ####"
echo "########################################################"
echo ""

# Install Postgres seperately first before running this file as we will not be using
# brew install postgres

sudo ln -sfv /usr/local/opt/postgresql/*.plist ~/Library/LaunchAgents

sudo launchctl load ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist

cp database

psql --host=$server --port=$port --user=$username --file=./init.sql

cp ../
