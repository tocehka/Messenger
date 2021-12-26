#!/bin/bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get -y upgrade
apt-get -y install pkg-config gcc

# Delete cached files we don't need anymore:
apt-get clean
rm -rf /var/lib/apt/lists/*