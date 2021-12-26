
FROM python:3.9slim

WORKDIR /usr/src/app

COPY install_linux_dep.sh ./
RUN chmod +x ./install_linux_dep.sh
RUN ./install_linux_dep.sh

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

ADD . ./