#! /bin/sh


set -x

RUN_ID=$(date +%Y%m%d-%H%M%S)
echo "Running with RUN_ID=$RUN_ID, TEST_ENV=$TEST_ENV"

mkdir -p /mnt/results/$TEST_ENV/$RUN_ID
# RUN THE TEST CASES
robot -d /mnt/results/$TEST_ENV/$RUN_ID  -i "@web" Test


echo "Logs stored in /mnt/results/$TEST_ENV/$RUN_ID (host path: /data/results/$TEST_ENV/$RUN_ID)"

# move the data to s3 storage
# aws s3 cp /mnt/results/$TEST_ENV/$RUN_ID   s3://$S3_BUCKET_NAME/$RUN_ID   --recursive
# --recursive COPY ALL FOLDER stcture

# dlete the existing folder created in the esk
# rm -rf /mnt/results/$TEST_ENV/$RUN_ID
echo "Done!"

# iw will upadte after get more storage to results 
cd /mnt/results/$TEST_ENV/$RUN_ID
python3 -m http.server 8000