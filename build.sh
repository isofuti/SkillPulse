#!/bin/bash

# Установка Python 3.9
curl -sSL https://www.python.org/ftp/python/3.9.18/Python-3.9.18.tgz | tar xz
cd Python-3.9.18
./configure --enable-optimizations
make -j $(nproc)
make altinstall
cd ..

# Установка зависимостей Python
python3.9 -m pip install --upgrade pip
python3.9 -m pip install -r requirements.txt

# Установка и сборка фронтенда
cd frontend
npm install
npm run build 