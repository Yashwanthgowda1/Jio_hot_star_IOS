FROM python:3.12-slim AS Build
WORKDIR  /Automation
# clean up th conatiner and update the reuired docker plugins

RUN apt-get update && apt-get install -y gcc \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY  requirements.txt .
# insted dirctly store the dependec in user/bin or user/local/bin store user
# --no-cache-dir  --> in pip do not store the insteed dependece
RUN   pip install --user --no-cache-dir -r requirements.txt

#------------------------------multsatge---------

FROM python:3.12-slim
WORKDIR  /Automation
# copy all insted thisg from the singlestage   
COPY --from=Build  /root/.local  /root/.local

ENV PATH=/root/.local/bin:$PATH
COPY . .
# setthe  path of the env
ENV TEST_ENV=QA

EXPOSE 8000
CMD [ "robot" , "-d" ,"results/ci_cd_runs", "-i", "@web", "Test" ]

