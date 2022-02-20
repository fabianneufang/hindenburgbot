chmod u+x build.sh
perl -i -pe 'y|\r||d' build.sh
sh build.sh &> build.log
