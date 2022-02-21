perl -i -pe 'y|\r||d' build.sh
chmod u+x build.sh
sh build.sh &> build.log
