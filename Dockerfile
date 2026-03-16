# -------------------- Build Stage --------------------
FROM python:3.11-slim AS Build

WORKDIR /Automation

# Install build tools (only needed for compiling some Python libs)
RUN apt-get update && \
    # this apt install helps to the force fully download with out interact with debain frontend error 100
    apt-get install -y --no-install-recommends \
    gcc \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

  # Install dependencies into user directory
 # insted dirctly store the dependec in user/bin or user/local/bin store ---> user
 # --no-cache-dir  --> in pip do not store the installed dependece
RUN pip install --user --no-cache-dir -r requirements.txt


# -------------------- Runtime Stage --------------------
FROM python:3.11-slim

WORKDIR /Automation

# Install chromium + required runtime libs
RUN apt-get update && \
    apt-get install -y \
    chromium \
    chromium-driver \
    fonts-liberation \
    libnss3 \
    libatk-bridge2.0-0 \
    libxkbcommon0 \
    libgtk-3-0 \
    libgbm1 \
    libasound2 \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from build stage
COPY --from=Build /root/.local /root/.local

# Add python user bin to PATH
ENV PATH="/root/.local/bin:$PATH"

# Copy project

COPY . /Automation

# Python module path
# it helps to tell the .py file while going you main path present inside the /automation means resource/liberry/python.py
ENV PYTHONPATH=/Automation

# Test environment setup
ENV TEST_ENV=QA

# Remove old logs if exist
RUN rm -rf /Automation/results /Automation/chrome_logs