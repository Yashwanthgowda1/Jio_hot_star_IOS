#! /bin/sh


set -x

RUN_ID=$(date +%Y%m%d-%H%M%S)
echo "Running with RUN_ID=$RUN_ID, TEST_ENV=$TEST_ENV"

mkdir -p /mnt/results/$TEST_ENV/$RUN_ID

# RUN THE TEST CASES
ROBOT_EXIT_CODE=0
robot -d /mnt/results/$TEST_ENV/$RUN_ID -i "@web" Test || ROBOT_EXIT_CODE=$?


echo "Logs stored in /mnt/results/$TEST_ENV/$RUN_ID (host path: /data/results/$TEST_ENV/$RUN_ID)"

if [ "$ROBOT_EXIT_CODE" -ne 0 ]; then
    exit "$ROBOT_EXIT_CODE"
fi

if [ "$RUN_TESTS_ONLY" = "true" ]; then
    echo "Test run complete."
    exit 0
fi

# move the data to s3 storage
# aws s3 cp /mnt/results/$TEST_ENV/$RUN_ID   s3://$S3_BUCKET_NAME/$RUN_ID   --recursive
# --recursive COPY ALL FOLDER stcture

# dlete the existing folder created in the esk
# rm -rf /mnt/results/$TEST_ENV/$RUN_ID
echo "Done!"

# iw will upadte after get more storage to results 
cd /mnt/results/$TEST_ENV/$RUN_ID
python3 -m http.server 8000