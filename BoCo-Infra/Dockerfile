FROM debian:bookworm-slim

ARG BOOST_VERSION=1.82.0
ARG BCREPO=https://github.com/Rule4Inc/BoCo-RCV-RLA.git
ARG PIPENV_VENV_IN_PROJECT=true

# Install package dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        software-properties-common \
        autoconf \
        automake \
        less \ 
        libtool \
        pkg-config \
        ca-certificates \
        libssl-dev \
        wget \
        git \
        curl \
        locales \
        locales-all \
        vim \
        unzip \
        gdb \
        pipenv \
        procps \
        net-tools \
        npm \
        screen && \
    apt-get clean && \
    cd /tmp && \
    BOOST_VERSION_MOD=$(echo $BOOST_VERSION | tr . _) && \
    wget https://boostorg.jfrog.io/artifactory/main/release/${BOOST_VERSION}/source/boost_${BOOST_VERSION_MOD}.tar.bz2 && \
    tar --bzip2 -xf boost_${BOOST_VERSION_MOD}.tar.bz2 && \
    cd boost_${BOOST_VERSION_MOD} && \
    ./bootstrap.sh --prefix=/usr/local && \
    ./b2 install && \
    cd /tmp && \
    rm -rf /tmp/boost_${BOOST_VERSION_MOD} && \
    rm boost_${BOOST_VERSION_MOD}.tar.bz2


# System locale
# Important for UTF-8
ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8

# Store .venv in project directory
ENV PIPENV_VENV_IN_PROJECT=true


# Install Boost
# https://www.boost.org/doc/libs/1_82_0/more/getting_started/unix-variants.html
RUN cd /tmp && \
    BOOST_VERSION_MOD=$(echo $BOOST_VERSION | tr . _) && \
    wget https://boostorg.jfrog.io/artifactory/main/release/${BOOST_VERSION}/source/boost_${BOOST_VERSION_MOD}.tar.bz2 && \
    tar --bzip2 -xf boost_${BOOST_VERSION_MOD}.tar.bz2 && \
    cd boost_${BOOST_VERSION_MOD} && \
    ./bootstrap.sh --prefix=/usr/local && \
    ./b2 install && \
    cd /tmp && \
    rm -rf /tmp/boost_${BOOST_VERSION_MOD} && \
    rm boost_${BOOST_VERSION_MOD}.tar.bz2


# Get repo for BC environment.
# Compile and install audit-irv-cp tool
# Setup SHANGRLA environment environments (via pipenv) for 2020 and 2023 code
# Prep the node envrionment for the MVR tool
RUN cd /opt && \
    git clone https://github.com/Rule4Inc/BoCo-RCV-RLA.git && \
    chmod 750 /opt/BoCo-RCV-RLA/BoCo-Infra/boco-startup.sh && \
    ln -s /opt/BoCo-RCV-RLA/BoCo-Infra/boco-startup.sh /usr/local/sbin/boco-startup.sh && \
    cd /opt/BoCo-RCV-RLA/IRV-RLA && \
    make && \
    mv irvaudit /usr/local/bin/ && \
    cd /opt/BoCo-RCV-RLA/SHANGRLA/2020 && \
    pipenv install numpy pandas jupyterlab cryptorandom openpyxl && \
    cd /opt/BoCo-RCV-RLA/SHANGRLA/2023 && \
    pipenv install numpy pandas jupyterlab cryptorandom openpyxl && \
    cd /opt/BoCo-RCV-RLA/MVR && \
    npm install

ENTRYPOINT ["/usr/local/sbin/boco-startup.sh"]
