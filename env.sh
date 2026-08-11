#!/usr/bin/env bash
# Nguồn: source env.sh  - nạp Java + JMeter portable trong tools/ (không cài hệ thống)
export HW05_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export JAVA_HOME="$HW05_ROOT/tools/jdk-21.0.12+8-jre"
export JMETER_HOME="$HW05_ROOT/tools/apache-jmeter-5.6.3"
export PATH="$JAVA_HOME/bin:$JMETER_HOME/bin:$PATH"
