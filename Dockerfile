# -------------------- Build Stage --------------------
FROM python:3.11-slim AS build

WORKDIR /Automation

COPY requirements.txt .

# Only install build tools if your requirements.txt has C-extensions.
# If all packages are pure Python, remove this entire RUN block.
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc g++ build-essential && \
    pip install --user --no-cache-dir -r requirements.txt && \
    apt-get purge -y gcc g++ build-essential && \
    rm -rf /var/lib/apt/lists/*

# -------------------- Runtime Stage --------------------
FROM python:3.11-slim

WORKDIR /Automation

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        chromium \
        chromium-driver \
        fonts-liberation \
        libnss3 \
        libatk-bridge2.0-0 \
        libxkbcommon0 \
        libgtk-3-0 \
        libgbm1 \
        libasound2t64 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /root/.local /root/.local

ENV PATH="/root/.local/bin:$PATH"
ENV PYTHONPATH=/Automation
ENV TEST_ENV=QA

COPY . /Automation

RUN rm -rf /Automation/results /Automation/chrome_logs && \
    chmod +x /Automation/scripts/run_tests.sh

CMD ["/Automation/scripts/run_tests.sh"]